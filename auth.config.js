module.exports = {
  products: {
    write: 'ownerOnly'
  },
  carts: {
    read: 'ownerOnly',
    write: 'ownerOnly'
  }
}
