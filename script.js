// ------------------------
// MINIMAL NOTES WEBSITE
// ------------------------

window.onload = () => showMainOptions();  // ✅ This ensures the first menu appears when the page loads

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Minimal Notes</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Minimal Notes</h1>
    <p class="subheading">Making Notes Minimal 📘</p>
  </header>

  <!-- Main type selection -->
  <div id="main-container" class="container"></div>

  <!-- Subject selection -->
  <div id="subject-container" class="container hidden"></div>

  <!-- Chapter selection -->
  <div id="chapter-container" class="container hidden"></div>

  <!-- Login form -->
  <div id="login-container" class="container hidden">
    <h3>Login</h3>
    <input type="text" id="username" placeholder="Username">
    <input type="password" id="password" placeholder="Password">
    <button id="loginBtn">Login</button>
  </div>

  <!-- Code entry -->
  <div id="code-container" class="container hidden">
    <h3>Enter Access Code</h3>
    <input type="text" id="codeInput" placeholder="Enter code">
    <button id="codeSubmit">Submit</button>
  </div>

  <!-- PDF display -->
  <div id="pdf-container" class="container hidden"></div>

  <footer>
    <p>© 2025 Minimal Notes. Built with ❤️ simplicity.</p>
  </footer>
  
<script defer src="script.js"></script>
</body>
</html>




