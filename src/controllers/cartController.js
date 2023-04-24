const cartController = {
    getAllCarts: async (req, res) => {
        try {
            const carts = await cartManagerInstance.getAllCarts();
            res.json(carts);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener los carritos');
        }
    }, 
    getCartById: async (req, res) => {
        try {
            const cartId = req.params.cid;
            const cart = await cartManagerInstance.getCartById(cartId);
            res.json(cart);
        } catch (error) {
            console.error(error);
            res.status(404).send('Error al obtener el carrito');
        }
    },
    addToCart:async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = parseInt(req.params.pid);
            const quantity = parseInt(req.body.quantity);
        
            const cart = await cartManagerInstance.addProductToCart(cartId, productId, quantity);
        
            res.json(cart);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al agregar el producto al carrito');
        }
    },
    removeCart: async (req, res) => {
        try {
            const cartId = req.params.cartId;
            await cartManagerInstance.removeCart(cartId);
          res.status(204).send(); // 204: Sin contenido
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al eliminar el carrito');
        }
    },
    addNewCart: async (_req, res) => {
        try {
            const cart = await cartManagerInstance.addCart();
            res.json(cart);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al agregar el carrito');
        }    
    }
};    

module.exports = cartController;