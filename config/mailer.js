module.exports = {
  active: process.env.EMAIL_SEND === 'true',
  mailchimpKey: process.env.EMAIL_KEY,
  sender: {
    email: 'stf@filos.unam.mx',
    name: 'Seminario TF'
  }
}
