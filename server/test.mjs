async function f(n) {
  return new Promise(function (resolve, reject) {
    if (n & 1) resolve("Odd");
    else reject("Not Odd");
  });
}

function g() {
  try {
    const res = await f(10);
  } catch (err) {
    console.log("in err");
    console.log(err);
  }
}
