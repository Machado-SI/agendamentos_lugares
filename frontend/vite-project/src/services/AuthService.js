export const IstokenExpired = (token) => {
    if (!token) return true
    try {
    // Decodifica manualmente o payload do token
    const payload = JSON.parse(atob(token.split('.')[1]))      
    const expiry = payload.exp

    // Verifica se o tempo atual é maior ou igual ao tempo de expiração
    return Math.floor(Date.now() / 1000) >= expiry
    } catch (error) {
        return true
    }
}

export const getToken = () => {
    return localStorage.getItem('token')
}

export const removeToken = () => {
    localStorage.removeItem('token')
}

// Middleware que verefica e limpa token expirado
export const checkAuthToken = () => {
    const token = getToken()

    if (!token) {
        return false // Não tem token
    }

    if (IstokenExpired(token)) {
        removeToken()
        return false // Token expirado
    }

    return true // Token válido
}
