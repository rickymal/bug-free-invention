document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  const form_parsed = Object.fromEntries(new FormData(e.target));

  send_request(
    "/api/make_registration",
    "POST",
    new Headers(),
    JSON.stringify(form_parsed)
  )
    .then((e) => {
      if (e.status == 200) return e.headers.get("Authorization");

      throw new Error("Usuário nao achado");
    })
    .then((e) => {
        console.log("Registro realizado com sucesso realizado com sucesso")
        window.location.href = "http://localhost:3000/login"
    });
});
