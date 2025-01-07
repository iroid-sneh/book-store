import bookService from "./book.service";

class bookController {
    /**
     * @description: Sign Up Page
     * @param {*} req
     * @param {*} res
     */
    static async signupPage(req, res) {
        const data = await bookService.signupPage(req.body, res);
        // return res.send({ data: data });
    }

    /**
     * @description: User Sign Up
     * @param {*} req
     * @param {*} res
     */
    static async signup(req, res) {
        const data = await bookService.signup(req.body, req, res);
        return res.send({ data: data });
    }

    /**
     * @description: Login Page
     * @param {*} req
     * @param {*} res
     */
    static async loginPage(req, res) {
        const data = await bookService.loginPage(req, res);
        return
    }

    /**
     * @description: Login Users
     * @param {*} req
     * @param {*} res
     */
    static async login(req, res) {
        const data = await bookService.login(req.body, req, res);
        return res.send({ data: data });
    }

    /**
     * @description: View Cart Page
     * @param {*} req
     * @param {*} res
     */
    static async viewCartPage(req, res) {
        const data = await bookService.viewCartPage(req, res);
        return
    }
    /**
     * @description: Add itmes To Cart
     * @param {*} req 
     * @param {*} res 
     * */
    static async addToCart(req, res) {
        const data = await bookService.addToCart(req.body, req);
        return res.send({ data: data });
    }

    /**
     * @description: View Cart
     * @param {*} req 
     * @param {*} res 
     */
    static async viewCart(req, res) {
        const data = await bookService.ViewCart(req.body, req, res);
        return res.send({ data: data });
    }

    /**
     * @description: Remove Item from the cart
     * @param {*} req
     * @param {*} res
     */
    static async removeItemFromCart(req, res) {
        const data = await bookService.removeCartItem(req.params.id, req, res);
        return res.send({ data: data });
    }

    /**
     * @description: Stripe Page
     * @param {*} req
     * @param {*} res
     */
    static async stripePage(req, res) {
        const data = await bookService.stripePaymentPage(req, res);
        return
    }
};

export default bookController; 