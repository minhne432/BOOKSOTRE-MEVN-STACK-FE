function makeOrdersService() {
  const baseUrl = '/api/orders'
  const headers = {
    'Content-Type': 'application/json'
  }

  // Lấy access_token từ Local Storage
  const accessToken = localStorage.getItem('access_token')

  // Thêm access_token vào headers nếu tồn tại
  if (accessToken) {
    headers['Authorization'] = accessToken
  }

  async function addToCart(cartDetails) {
    try {
      const response = await fetch(`${baseUrl}/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(cartDetails)
      })

      const data = await response.json()
      return { ok: response.ok, data }
    } catch (error) {
      return { ok: false, message: 'Đã xảy ra lỗi khi gọi API thêm sản phẩm vào giỏ hàng' }
    }
  }

  async function getCartByUserId(user_id) {
    try {
      const response = await fetch(`${baseUrl}/${user_id}`, {
        method: 'GET',
        headers
      })

      const data = await response.json()
      return { ok: response.ok, data }
    } catch (err) {
      return { ok: false, message: 'Đã xảy ra lỗi khi gọi API lấy thông ti giỏ hàng' }
    }
  }
  async function deleteCartItemById(item_id) {
    try {
      const response = await fetch(`${baseUrl}/cart/${item_id}`, {
        method: 'DELETE',
        headers
      })
      return { ok: response.ok }
    } catch (err) {
      return { message: 'đã xảy ra lỗi khi xóa sản phẩm trong giỏ hàng' }
    }
  }

  async function createOrder(orderDatas) {
    try {
      const response = await fetch(`${baseUrl}/new`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderDatas)
      })

      const data = await response.json()
      return { ok: response.ok, data }
    } catch (error) {
      return { ok: false, message: 'Đã xảy ra lỗi khi gọi API mua hàng' }
    }
  }
  return {
    addToCart,
    getCartByUserId,
    deleteCartItemById,
    createOrder
  }
}

export default makeOrdersService()
