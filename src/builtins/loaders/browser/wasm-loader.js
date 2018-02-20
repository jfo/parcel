module.exports = function loadWASMBundle(bundle) {
  return fetch(bundle)
    .then(function (res) {
      if (WebAssembly.instantiateStreaming) {
        return WebAssembly.instantiateStreaming(res, {
          env: {
            __linear_memory: new WebAssembly.Memory({initial: 10}),
            __indirect_function_table: new WebAssembly.Table({element:'anyfunc', initial: 10})
          }
        });
      } else {
        return res.arrayBuffer()
          .then(function (data) {
            return WebAssembly.instantiate(data, {});
          });
      }
    })
    .then(function (wasmModule) {
      return wasmModule.instance.exports;
    });
};
