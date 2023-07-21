module.exports = [
    {
      context: ["/api/**"],
      target: "http://localhost:8080",
      secure: false
    },
    {
      context: [ "/logout"],
      target: "http://localhost:8080",
      secure: false
    },
    {
      context: ["/query"],
      target: "https://www.alphavantage.co",
      secure: false,
      changeOrigin: true,
    }

  ]

