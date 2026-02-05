const axios = require('axios');

async function verify() {
    try {
        const baseURL = 'http://localhost:5000/api';
        
        // 1. Register Users
        const adminUser = (await axios.post(`${baseURL}/auth/register`, {
            username: `admin_${Date.now()}`,
            email: `admin_${Date.now()}@test.com`,
            password: 'password'
        })).data;
        console.log("Admin User Created:", adminUser._id);

        const memberUser = (await axios.post(`${baseURL}/auth/register`, {
            username: `member_${Date.now()}`,
            email: `member_${Date.now()}@test.com`,
            password: 'password'
        })).data;
        console.log("Member User Created:", memberUser._id);

        // 2. Create Group
        const group = (await axios.post(`${baseURL}/conversations`, {
            senderId: adminUser._id,
            members: [memberUser._id],
            isGroup: true,
            groupName: "Test Group"
        })).data;
        console.log("Group Created:", group._id);
        
        // 3. Verify Admin
        if (group.admins.includes(adminUser._id)) {
            console.log("PASS: Creator is Admin");
        } else {
            console.error("FAIL: Creator is NOT Admin", group.admins);
        }

        // 4. Add Member (Simulate another user)
        const anotherUser = (await axios.post(`${baseURL}/auth/register`, {
            username: `other_${Date.now()}`,
            email: `other_${Date.now()}@test.com`,
            password: 'password'
        })).data;

        await axios.put(`${baseURL}/conversations/add-member`, {
            conversationId: group._id,
            memberId: anotherUser._id,
            adminId: adminUser._id // As Admin
        });
        console.log("PASS: Added Member");

        // 5. Make member admin
        await axios.put(`${baseURL}/conversations/make-admin`, {
            conversationId: group._id,
            memberId: memberUser._id,
            adminId: adminUser._id
        });
        console.log("PASS: Promoted Member");
        
        // Check final state
        const updatedReq = await axios.get(`${baseURL}/conversations/${adminUser._id}`);
        const updatedGroup = updatedReq.data.find(c => c._id === group._id);
        
        if (updatedGroup.admins.includes(memberUser._id)) {
             console.log("PASS: Member is now Admin");
        } else {
             console.error("FAIL: Member verification failed", updatedGroup.admins);
        }

    } catch (err) {
        console.error("Verification Failed:", err.response ? err.response.data : err.message);
    }
}

verify();
