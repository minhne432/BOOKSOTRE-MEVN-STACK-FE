function makeBooksService() {
  const baseUrl = '/api/products'
  const headers = {
    'Content-Type': 'application/json'
  }

  // Lấy access_token từ Local Storage
  const accessToken = localStorage.getItem('access_token')

  // Thêm access_token vào headers nếu tồn tại
  if (accessToken) {
    headers['Authorization'] = accessToken
  }

  // CREATE
  async function createBook(book) {
    const formData = new FormData()
    formData.append('image', book.image)
    formData.append('name', book.name)
    formData.append('category_id', book.category_id)
    formData.append('price', book.price)
    formData.append('description', book.description)
    // Thêm các trường thông tin sách khác nếu cần

    // Lấy access_token từ Local Storage
    const accessToken = localStorage.getItem('access_token')

    // Tạo headers cho yêu cầu fetch
    const headers = {}
    if (accessToken) {
      headers['Authorization'] = `${accessToken}`
    }

    // Gửi yêu cầu fetch với formData và headers mới
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers,
      body: formData
    })

    return response.json()
  }
  //  UPDATE
  async function updateBook(id, book) {
    const formData = new FormData()
    formData.append('image', book.image)
    formData.append('name', book.name)
    formData.append('category_id', book.category_id)
    formData.append('price', book.price)
    formData.append('description', book.description)
    // Thêm các trường thông tin sách khác nếu cần

    // Lấy access_token từ Local Storage
    const accessToken = localStorage.getItem('access_token')

    // Tạo headers cho yêu cầu fetch
    const headers = {}
    if (accessToken) {
      headers['Authorization'] = `${accessToken}`
    }

    // Gửi yêu cầu fetch với formData và headers mới
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers,
      body: formData
    })

    return response.json()
  }

  // GET
  async function getBook(id) {
    return await fetch(`${baseUrl}/${id}`).then((res) => res.json())
  }

  async function getBooks(page, limit = 8) {
    let url = `${baseUrl}?page=${page}&limit=${limit}`
    return await fetch(url).then((res) => {
      const data = res.json()
      // console.log(data)
      return data
    })
  }

  // DETELE
  async function deleteBook(id) {
    return await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers
    }).then((res) => res.json())
  }
  async function deleteAllBooks() {
    return await fetch(baseUrl, {
      method: 'DELETE'
    }).then((res) => res.json())
  }
  return {
    getBook,
    getBooks,
    deleteBook,
    deleteAllBooks,
    createBook,
    updateBook
  }
}

export default makeBooksService()
