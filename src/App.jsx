import React, { useState, useEffect } from 'react'

const sampleCourses = [
  {
    id: 'c1',
    title: 'Lógica de Programação - Do Zero ao Avançado',
    short: 'Aprenda pensamento lógico, algoritmos e estruturas de controle.',
    price: 49.0,
    level: 'Iniciante',
    lessons: 28,
    duration: '12h',
    tags: ['lógica', 'algoritmo', 'iniciante'],
  },
  {
    id: 'c2',
    title: 'Python para Lógica e Automação',
    short: 'Use Python para traduzir algoritmos em código e automatizar tarefas.',
    price: 69.0,
    level: 'Intermediário',
    lessons: 35,
    duration: '18h',
    tags: ['python', 'automação'],
  },
  {
    id: 'c3',
    title: 'Estruturas de Dados e Algoritmos',
    short: 'Listas, pilhas, filas, árvores e como pensar em eficiência.',
    price: 79.0,
    level: 'Avançado',
    lessons: 40,
    duration: '22h',
    tags: ['algoritmos', 'estruturas'],
  },
  {
    id: 'c4',
    title: 'JavaScript: Lógica aplicada ao Frontend',
    short: 'Aprenda a aplicar lógica em problemas reais do frontend com JS.',
    price: 59.0,
    level: 'Intermediário',
    lessons: 30,
    duration: '15h',
    tags: ['javascript', 'frontend'],
  },
]

export default function App() {
  const [courses] = useState(sampleCourses)
  const [query, setQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState('Todos')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('cart_courses')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderStatus, setOrderStatus] = useState(null)

  useEffect(() => {
    localStorage.setItem('cart_courses', JSON.stringify(cart))
  }, [cart])

  const filtered = courses.filter((c) => {
    const q = query.trim().toLowerCase()
    const matchQuery = q === '' || c.title.toLowerCase().includes(q) || c.short.toLowerCase().includes(q) || c.tags.join(' ').toLowerCase().includes(q)
    const matchLevel = levelFilter === 'Todos' || c.level === levelFilter
    return matchQuery && matchLevel
  })

  function addToCart(course) {
    setCart((cur) => {
      if (cur.find((x) => x.id === course.id)) return cur
      return [...cur, course]
    })
  }

  function removeFromCart(id) {
    setCart((cur) => cur.filter((c) => c.id !== id))
  }

  function totalPrice() {
    return cart.reduce((s, c) => s + c.price, 0).toFixed(2)
  }

  function handleCheckoutSubmit(form) {
    const order = {
      id: `ORD-${Date.now()}`,
      name: form.name,
      email: form.email,
      items: cart,
      total: totalPrice(),
      date: new Date().toISOString(),
    }
    setOrderStatus('processando')
    setTimeout(() => {
      setOrderStatus({ success: true, order })
      setCart([])
      setShowCheckout(false)
      localStorage.removeItem('cart_courses')
      setTimeout(() => setOrderStatus(null), 3500)
    }, 900)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="logo">LP</div>
          <div>
            <h1>Cursos de Lógica & Programação</h1>
            <p className="muted">Aprenda do zero até projetos reais</p>
          </div>
        </div>
        <div className="controls">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar cursos..." className="input" />
          <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="select">
            <option>Todos</option>
            <option>Iniciante</option>
            <option>Intermediário</option>
            <option>Avançado</option>
          </select>
          <button className="btn cart" onClick={() => setShowCheckout(true)}>Carrinho ({cart.length})</button>
        </div>
      </header>

      <main className="container">
        <aside className="sidebar">
          <h2>Sobre</h2>
          <p className="muted">Venda de cursos focados em lógica e programação. Aulas gravadas, exercícios e projetos práticos.</p>
          <div className="filter-box">
            <h3>Níveis</h3>
            {['Todos', 'Iniciante', 'Intermediário', 'Avançado'].map((lev) => (
              <button key={lev} className={`chip ${levelFilter === lev ? 'active' : ''}`} onClick={() => setLevelFilter(lev)}>{lev}</button>
            ))}
          </div>
        </aside>

        <section className="content">
          <div className="grid">
            {filtered.map((course) => (
              <article key={course.id} className="card">
                <div className="card-left">
                  <div className="thumb">{course.title.split(' ').slice(0,2).map(s => s[0]).join('')}</div>
                </div>
                <div className="card-body">
                  <h3>{course.title}</h3>
                  <p className="muted">{course.short}</p>
                  <div className="meta">
                    <span>{course.level}</span>
                    <span>{course.lessons} aulas</span>
                    <span>{course.duration}</span>
                  </div>
                </div>
                <div className="card-right">
                  <div className="price">R$ {course.price.toFixed(2)}</div>
                  <div className="actions">
                    <button className="btn" onClick={() => setSelectedCourse(course)}>Ver</button>
                    <button className="btn primary" onClick={() => addToCart(course)}>Adicionar</button>
                  </div>
                </div>
              </article>
            ))}

            {filtered.length === 0 && <div className="empty">Nenhum curso encontrado.</div>}
          </div>

          <div className="cart-box">
            <h3>Resumo do Carrinho</h3>
            {cart.length === 0 ? <p className="muted">Seu carrinho está vazio.</p> : (
              <div>
                <ul className="cart-list">
                  {cart.map(c => (
                    <li key={c.id} className="cart-item">
                      <div>
                        <div className="fw">{c.title}</div>
                        <div className="muted">R$ {c.price.toFixed(2)}</div>
                      </div>
                      <button className="link" onClick={() => removeFromCart(c.id)}>Remover</button>
                    </li>
                  ))}
                </ul>
                <div className="cart-total">
                  <div>Total</div>
                  <div className="fw">R$ {totalPrice()}</div>
                </div>
                <div className="cart-actions">
                  <button className="btn primary" onClick={() => setShowCheckout(true)}>Finalizar compra</button>
                  <button className="btn" onClick={() => { setCart([]); localStorage.removeItem('cart_courses') }}>Limpar</button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {selectedCourse && (
        <div className="modal-backdrop" onClick={() => setSelectedCourse(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedCourse.title}</h2>
            <p className="muted">{selectedCourse.short}</p>
            <div className="meta">
              <span>{selectedCourse.level}</span>
              <span>{selectedCourse.lessons} aulas</span>
            </div>
            <div className="modal-actions">
              <div className="price">R$ {selectedCourse.price.toFixed(2)}</div>
              <div>
                <button className="btn primary" onClick={() => addToCart(selectedCourse)}>Adicionar</button>
                <button className="btn" onClick={() => setSelectedCourse(null)}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCheckout && <CheckoutModal cart={cart} onClose={() => setShowCheckout(false)} onSubmit={handleCheckoutSubmit} />}

      {orderStatus && (
        <div className="toast">{orderStatus === 'processando' ? 'Processando pedido...' : `Pedido realizado! ID: ${orderStatus.order.id}`}</div>
      )}
    </div>
  )
}

function CheckoutModal({ cart, onClose, onSubmit }) {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [agree, setAgree] = React.useState(true)
  const [error, setError] = React.useState(null)

  function submit(e) {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !email.trim()) {
      setError('Preencha nome e e-mail')
      return
    }
    if (cart.length === 0) {
      setError('O carrinho está vazio')
      return
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('E-mail inválido')
      return
    }
    onSubmit({ name, email, agree })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Finalizar compra</h3>
          <button className="link" onClick={onClose}>Fechar</button>
        </div>
        <form onSubmit={submit} className="form">
          <label>Nome
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>E-mail
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="checkbox"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> Aceito receber materiais</label>
          {error && <div className="error">{error}</div>}
          <div className="form-actions">
            <div>Total: <strong>R$ {cart.reduce((s,c) => s + c.price, 0).toFixed(2)}</strong></div>
            <div>
              <button type="button" className="btn" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn primary">Pagar (simulado)</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
