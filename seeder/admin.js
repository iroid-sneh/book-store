import Admin from '../models/admin';

const admin = async () => {
    const adminData = {
        email: "admin@gmail.com",
        password: '$2y$12$ghkZX2MM/douHFJnsO9iUu/LM88cQ/TcK8WZR4oIkKJF7nS1ItVTO' //admin@123
    }

    const findData = await Admin.find({});
    if(findData.length === 0 ){
        const insert = await Admin.create(adminData);
        console.log("Admin Seeded");
        return true;
    }
}

admin();

export default admin;