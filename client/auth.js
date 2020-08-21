// oauth 2.0 functions for clientside
'use strict'

async function login() {
  const url = window.location.href;
  window.location.replace(url + 'google');
}

async function logout() {
  console.log("logging out");

  const response = await fetch('/logout');
  if(response.ok) {
    console.log("logged out");
  } else {
    console.error("failed to log out");
  }

  remove_headerButtons();
  await add_headerButtons();
}

/**
 * checks if the user has an authenticated session
 * @returns {boolean} true if authenticated
 */
async function checkAuth() {
  try {
    const response = await fetch('/api/authCheck');
    return response.ok;
  } catch(e) {
    return response.ok;
  }
}
