import User from "../../models/user";

class userService {
    /**
     * @description: Users Page
     * @param {*} req
     * @param {*} res
     */
    static async userPage(req, res) {
        return res.render('users/userTable');
    }

    /**
      * @description: Users List For Admin
      * @param {*} query
      * @param {*} req 
      * @param {*} res 
      */
    static async usersList(query, req, res) {

        const { draw, start, length, search } = query;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;

        const search_value = search && search.value ? search.value : "";
        const search_query = {
            $or: [{ "name": { $regex: search_value, $options: "i" } }, { "email": { $regex: search_value, $options: "i" } }]
        };

        const data = await User.find(search_value ? search_query : {})
            .skip(page)
            .limit(limit)
            .sort({ 'created_at': -1 });
        const count = await User.countDocuments();

        const total_records_filtered = await User.countDocuments(search_query);


        return res.send({
            draw: draw,
            iTotalRecords: count,
            iTotalDisplayRecords: total_records_filtered,
            data: data
        });
    }
}

export default userService;