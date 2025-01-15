import adminService from "./admin.service";

class adminController {
    /**
     * @description: Admin Login Page
     * @param {*} req
     * @param {*} res
     */
    static async adminLoginPage(req, res) {
        const data = await adminService.adminLoginPage(req, res);
        return
    }

    /**
     * @description: admin login
     * @param {*} req 
     * @param {*} res 
     */
    static async adminLogin(req, res) {
        const data = await adminService.AdminLogin(req.body, req, res);
        return 
    }

    /**
     * @description: Dashboard Page
     * @param {*} req
     * @param {*} res
     */
    static async dashboard(req, res) {
        const data = await adminService.dashboard(req, res);
        return
    }

    /**
     * @description: User Page
     * @param {*} req
     * @param {*} res
     */
    static async userPage(req, res) {
        const data = await adminService.userPage(req, res);
        return
    }

    /**
     * @description: Logout 
     * @param {*} req
     * @param {*} res
     */
    static async logout(req, res) {
        const data = await adminService.logout(req, res);
        return
    }
}

export default adminController;