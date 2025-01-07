import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
  rating: number
}

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: 999.99,
      description: "Latest Apple iPhone with advanced camera system and A17 Pro chip",
      image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-black-titanium-select?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1692875267993",
      category: "Smartphones",
      stock: 50,
      rating: 4.8
    },
    {
      id: 2,
      name: "MacBook Pro 16",
      price: 2499.99,
      description: "Powerful laptop with M2 Pro chip for professional use",
      image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1671304673202",
      category: "Laptops",
      stock: 30,
      rating: 4.9
    },
    {
      id: 3,
      name: "PlayStation 5",
      price: 499.99,
      description: "Next-gen gaming console with stunning graphics and fast loading",
      image: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21",
      category: "Gaming",
      stock: 25,
      rating: 4.7
    },
    {
      id: 4,
      name: "Samsung QLED 4K TV",
      price: 1299.99,
      description: "65-inch 4K Smart TV with Quantum HDR and Alexa built-in",
      image: "https://images.samsung.com/is/image/samsung/p6pim/uk/qe65q60bauxxu/gallery/uk-qled-q60b-qe65q60bauxxu-531504744?$650_519_PNG$",
      category: "TVs",
      stock: 15,
      rating: 4.6
    },
    {
      id: 5,
      name: "iPad Air",
      price: 599.99,
      description: "Versatile tablet with M1 chip and stunning Liquid Retina display",
      image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1645065732688",
      category: "Tablets",
      stock: 40,
      rating: 4.8
    },
    {
      id: 6,
      name: "Sony WH-1000XM4",
      price: 349.99,
      description: "Premium wireless noise-cancelling headphones",
      image: "https://electronics.sony.com/image/5d02da5df552836db894cad8e2a0e804?fmt=png-alpha&wid=800&hei=800",
      category: "Audio",
      stock: 35,
      rating: 4.9
    },
    {
      id: 7,
      name: "Nintendo Switch OLED",
      price: 349.99,
      description: "Hybrid gaming console with vibrant OLED display",
      image: "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_400/ncom/en_US/switch/site-design-update/hardware/switch/nintendo-switch-oled-model-white-set/gallery/image01",
      category: "Gaming",
      stock: 20,
      rating: 4.7
    },
    {
      id: 8,
      name: "Canon EOS R6",
      price: 2499.99,
      description: "Professional mirrorless camera with 20MP full-frame sensor",
      image: "https://static.bhphoto.com/images/images500x500/canon_eos_r6_mirrorless_digital_1594281159_1547010.jpg",
      category: "Cameras",
      stock: 10,
      rating: 4.8
    },
    {
      id: 9,
      name: "Samsung Galaxy Watch 5",
      price: 279.99,
      description: "Advanced smartwatch with health monitoring features",
      image: "https://images.samsung.com/is/image/samsung/p6pim/uk/2208/gallery/uk-galaxy-watch5-40mm-sm-r900nzsaeua-533187693?$650_519_PNG$",
      category: "Wearables",
      stock: 45,
      rating: 4.6
    },
    {
      id: 10,
      name: "Dell XPS 13",
      price: 1299.99,
      description: "Ultra-portable laptop with InfinityEdge display",
      image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9315/media-gallery/notebook-xps-9315-nt-blue-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&wid=800&hei=800&qlt=100,1&resMode=sharp2&size=800,800&chrss=full",
      category: "Laptops",
      stock: 25,
      rating: 4.7
    }
  ])
  
  const cart = ref<{ product: Product; quantity: number }[]>([])

  // Computed properties
  const cartItemsCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0)
  })

  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + item.product.price * item.quantity, 0)
  })

  // Load initial data from localStorage
  const initializeStore = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        // Validate cart data
        if (Array.isArray(parsedCart) && parsedCart.every(item => 
          item.product && 
          typeof item.product === 'object' && 
          typeof item.quantity === 'number' && 
          item.quantity > 0
        )) {
          cart.value = parsedCart
        } else {
          localStorage.removeItem('cart')
        }
      } catch (error) {
        console.error('Failed to parse cart data:', error)
        localStorage.removeItem('cart')
      }
    }
  }

  // Helper function to save cart to localStorage
  const saveCart = () => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart.value))
    } catch (error) {
      console.error('Failed to save cart:', error)
    }
  }

  // Cart operations
  const addToCart = (product: Product) => {
    const existingItem = cart.value.find(item => item.product.id === product.id)
    
    // Check if we have enough stock
    const currentQuantity = existingItem ? existingItem.quantity : 0
    if (currentQuantity >= product.stock) {
      throw new Error('Not enough stock available')
    }

    if (existingItem) {
      existingItem.quantity++
    } else {
      cart.value.push({ product, quantity: 1 })
    }
    
    saveCart()
  }

  const removeFromCart = (productId: number) => {
    cart.value = cart.value.filter(item => item.product.id !== productId)
    saveCart()
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    const item = cart.value.find(item => item.product.id === productId)
    const product = products.value.find(p => p.id === productId)
    
    if (!item || !product) return
    
    // Validate quantity
    if (newQuantity < 1) {
      newQuantity = 1
    } else if (newQuantity > product.stock) {
      newQuantity = product.stock
    }
    
    item.quantity = newQuantity
    saveCart()
  }

  const incrementQuantity = (productId: number) => {
    const item = cart.value.find(item => item.product.id === productId)
    const product = products.value.find(p => p.id === productId)
    
    if (!item || !product) return
    
    if (item.quantity < product.stock) {
      item.quantity++
      saveCart()
    }
  }

  const decrementQuantity = (productId: number) => {
    const item = cart.value.find(item => item.product.id === productId)
    
    if (!item) return
    
    if (item.quantity > 1) {
      item.quantity--
      saveCart()
    }
  }

  const clearCart = () => {
    cart.value = []
    saveCart()
  }

  return {
    products,
    cart,
    cartItemsCount,
    cartTotal,
    initializeStore,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart
  }
})
