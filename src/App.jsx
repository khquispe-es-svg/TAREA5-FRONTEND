
import { useEffect, useState } from 'react'
import Product3DViewer from './components/Product3DViewer'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://trading-space-api-5ex6.onrender.com'
const API_URL = `${API_BASE_URL}/api/v1/products`

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    image_url: '',
  })

  async function loadProducts() {
    try {
      setError('')

      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('No se pudieron cargar los productos')
      }

      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          image_url: form.image_url.trim() || null,
        }),
      })

      if (!response.ok) {
        const detail = await response.json()
        throw new Error(
          detail.detail || 'No se pudo registrar el producto'
        )
      }

      setMessage('¡Producto registrado correctamente!')

      setForm({
        name: '',
        price: '',
        stock: '',
        image_url: '',
      })

      await loadProducts()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Catálogo de productos
          </h1>

          <p className="mt-2 text-slate-500">
            Administración y registro de productos
          </p>
        </header>

        <section className="mb-10 rounded-2xl bg-white p-6 shadow-md">
          <section className="mb-8">
  <h2 className="mb-4 text-xl font-bold text-slate-800">
    Visualización 3D del producto
  </h2>

  <Product3DViewer />
</section>
          <h2 className="mb-5 text-xl font-bold text-slate-800">
            Registrar nuevo producto
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nombre del producto
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej. iPhone 14"
                required
                className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Precio (Bs.)
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Ej. 4500"
                min="0.01"
                step="0.01"
                required
                className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Stock disponible
              </label>

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Ej. 5"
                min="0"
                step="1"
                required
                className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                URL de la imagen
              </label>

              <input
                type="url"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-600"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
              >
                {saving ? 'Registrando...' : 'Registrar producto'}
              </button>
            </div>

          </form>

          {message && (
            <p className="mt-4 rounded-lg bg-green-100 p-3 text-green-700">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">
              {error}
            </p>
          )}
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">
              Productos registrados
            </h2>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Total: {products.length}
            </span>
          </div>

          {loading && (
            <p className="text-blue-600">Cargando productos...</p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="rounded-xl bg-white p-6 text-slate-500 shadow">
              No hay productos registrados.
            </p>
          )}

          {!loading && products.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {products.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl bg-white p-5 shadow-md transition hover:shadow-xl"
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                      className="h-48 w-full rounded-xl bg-slate-100 object-contain"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      Sin imagen
                    </div>
                  )}

                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-slate-800">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-2xl font-bold text-blue-700">
                      Bs. {product.price}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Stock disponible: {product.stock}
                    </p>

                    <p className="mt-3 text-xs text-slate-400">
                      Código: {product.id}
                    </p>
                  </div>
                </article>
              ))}

            </div>
          )}
        </section>

      </div>
    </main>
  )
}

export default App
