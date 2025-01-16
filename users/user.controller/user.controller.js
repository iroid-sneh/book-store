import userService from "./user.service";

class userController {
    /**
     * @description: User Page
     * @param {*} req
     * @param {*} res
     */
    static async userPage(req, res) {
        const data = await userService.userPage(req, res);
        return
    }

    /**
     * @description: Users List
     * @param {*} req
     * @param {*} res
     */
    static async userList(req, res) {
        const data = await userService.usersList(req.query, req, res);
        return 
    }
}

export default userController; 