const express = require('express');
const CartManager = require('../CartManajer'); 
const router = express.Router();

const cartManager = new CartManager(__dirname + '/carrito.json');


router.get('/', async (req, res) => {
  const carts = await cartManager.getCarts();
  res.json(carts);
});

router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await cartManager.getCartById(cartId);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: 'Not found' });
  }
});

router.post('/', async (req, res) => {
  const cartData = req.body;
  try {
    await cartManager.addCart(cartData);
    res.status(201).json({ message: 'Cart created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const updatedData = req.body;
  try {
    await cartManager.updateCart(cartId, updatedData);
    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    res.status(404).json({ error: 'Not found' });
  }
});

router.delete('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    await cartManager.deleteCart(cartId);
    res.json({ message: 'Cart deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: 'Not found' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  try {
    const cart = await cartManager.getCartById(cartId);
    const product = await productManager.getProductById(productId);

    if (!cart || !product) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    const existingProduct = cart.products.find((item) => item.id === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity || 1;
    } else {
      cart.products.push({
        id: productId,
        quantity: quantity || 1,
      });
    }

    await cartManager.updateCart(cartId, cart);
    res.json({ message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(404).json({ error: 'Not found' });
  }
});

module.exports = router;
