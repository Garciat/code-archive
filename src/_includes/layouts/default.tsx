export default ({ children }: Lume.Data, _helpers: Lume.Helpers) => {
  return (
    <html>
      <head>
        <title>the drawer - garciat's code</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=0"
        />
        <link rel="stylesheet" href="/style/style.css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js">
        </script>
        <script src="/style/script.js"></script>
      </head>
      <body>
        <header>
          <h1>the drawer</h1>
        </header>
        {children}
      </body>
    </html>
  );
};
