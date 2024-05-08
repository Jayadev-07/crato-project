import "@scss/style.scss"

import AppProvider from "./providers/AppProvider"
import AppRouter from "./router"

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  )
}

export default App
