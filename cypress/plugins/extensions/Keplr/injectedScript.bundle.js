!(function (e) {
  var t = {};
  function i(n) {
    if (t[n]) return t[n].exports;
    var r = (t[n] = { i: n, l: !1, exports: {} });
    return e[n].call(r.exports, r, r.exports, i), (r.l = !0), r.exports;
  }
  (i.m = e),
    (i.c = t),
    (i.d = function (e, t, n) {
      i.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });
    }),
    (i.r = function (e) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    (i.t = function (e, t) {
      if ((1 & t && (e = i(e)), 8 & t)) return e;
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
      var n = Object.create(null);
      if ((i.r(n), Object.defineProperty(n, 'default', { enumerable: !0, value: e }), 2 & t && 'string' != typeof e))
        for (var r in e)
          i.d(
            n,
            r,
            function (t) {
              return e[t];
            }.bind(null, r),
          );
      return n;
    }),
    (i.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return i.d(t, 'a', t), t;
    }),
    (i.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (i.p = ''),
    i((i.s = 1753));
})({
  159: function (e, t, i) {
    'use strict';
    var n = function (e) {
      return (
        (function (e) {
          return !!e && 'object' == typeof e;
        })(e) &&
        !(function (e) {
          var t = Object.prototype.toString.call(e);
          return (
            '[object RegExp]' === t ||
            '[object Date]' === t ||
            (function (e) {
              return e.$$typeof === r;
            })(e)
          );
        })(e)
      );
    };
    var r = 'function' == typeof Symbol && Symbol.for ? Symbol.for('react.element') : 60103;
    function s(e, t) {
      return !1 !== t.clone && t.isMergeableObject(e) ? c(((i = e), Array.isArray(i) ? [] : {}), e, t) : e;
      var i;
    }
    function o(e, t, i) {
      return e.concat(t).map(function (e) {
        return s(e, i);
      });
    }
    function u(e) {
      return Object.keys(e).concat(
        (function (e) {
          return Object.getOwnPropertySymbols
            ? Object.getOwnPropertySymbols(e).filter(function (t) {
                return e.propertyIsEnumerable(t);
              })
            : [];
        })(e),
      );
    }
    function h(e, t) {
      try {
        return t in e;
      } catch (e) {
        return !1;
      }
    }
    function a(e, t, i) {
      var n = {};
      return (
        i.isMergeableObject(e) &&
          u(e).forEach(function (t) {
            n[t] = s(e[t], i);
          }),
        u(t).forEach(function (r) {
          (function (e, t) {
            return h(e, t) && !(Object.hasOwnProperty.call(e, t) && Object.propertyIsEnumerable.call(e, t));
          })(e, r) ||
            (h(e, r) && i.isMergeableObject(t[r])
              ? (n[r] = (function (e, t) {
                  if (!t.customMerge) return c;
                  var i = t.customMerge(e);
                  return 'function' == typeof i ? i : c;
                })(r, i)(e[r], t[r], i))
              : (n[r] = s(t[r], i)));
        }),
        n
      );
    }
    function c(e, t, i) {
      ((i = i || {}).arrayMerge = i.arrayMerge || o),
        (i.isMergeableObject = i.isMergeableObject || n),
        (i.cloneUnlessOtherwiseSpecified = s);
      var r = Array.isArray(t);
      return r === Array.isArray(e) ? (r ? i.arrayMerge(e, t, i) : a(e, t, i)) : s(t, i);
    }
    c.all = function (e, t) {
      if (!Array.isArray(e)) throw new Error('first argument should be an array');
      return e.reduce(function (e, i) {
        return c(e, i, t);
      }, {});
    };
    var d = c;
    e.exports = d;
  },
  160: function (e, t, i) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.MessageRegistry = void 0);
    t.MessageRegistry = class {
      constructor() {
        this.registeredMsgType = new Map();
      }
      registerMessage(e) {
        if (this.registeredMsgType.has(e.type())) throw new Error('Already registered type ' + e.type());
        this.registeredMsgType.set(e.type(), e);
      }
      parseMessage(e) {
        if (!e.type) throw new Error('Null type');
        const t = this.registeredMsgType.get(e.type);
        if (!t) throw new Error('Unregistered msg type ' + e.type);
        return Object.setPrototypeOf(e.msg, t.prototype);
      }
    };
  },
  161: function (e, t, i) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.JSONUint8Array = void 0);
    const n = i(266);
    class r {
      static parse(e) {
        return JSON.parse(e, (e, t) =>
          t && 'string' == typeof t && t.startsWith('__uint8array__') ? n.fromHex(t.replace('__uint8array__', '')) : t,
        );
      }
      static stringify(e) {
        return JSON.stringify(e, (e, t) => {
          if (
            t &&
            (t instanceof Uint8Array ||
              ('object' == typeof t && 'type' in t && 'data' in t && 'Buffer' === t.type && Array.isArray(t.data)))
          ) {
            const e = t instanceof Uint8Array ? t : new Uint8Array(t.data);
            return '__uint8array__' + n.toHex(e);
          }
          return t;
        });
      }
      static wrap(e) {
        if (void 0 !== e) return JSON.parse(r.stringify(e));
      }
      static unwrap(e) {
        if (void 0 !== e) return r.parse(JSON.stringify(e));
      }
    }
    t.JSONUint8Array = r;
  },
  171: function (e, t, i) {
    'use strict';
    var n =
      (this && this.__awaiter) ||
      function (e, t, i, n) {
        return new (i || (i = Promise))(function (r, s) {
          function o(e) {
            try {
              h(n.next(e));
            } catch (e) {
              s(e);
            }
          }
          function u(e) {
            try {
              h(n.throw(e));
            } catch (e) {
              s(e);
            }
          }
          function h(e) {
            var t;
            e.done
              ? r(e.value)
              : ((t = e.value),
                t instanceof i
                  ? t
                  : new i(function (e) {
                      e(t);
                    })).then(o, u);
          }
          h((n = n.apply(e, t || [])).next());
        });
      };
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.KeplrEnigmaUtils = void 0);
    t.KeplrEnigmaUtils = class {
      constructor(e, t) {
        (this.chainId = e), (this.keplr = t);
      }
      getPubkey() {
        return n(this, void 0, void 0, function* () {
          return yield this.keplr.getEnigmaPubKey(this.chainId);
        });
      }
      getTxEncryptionKey(e) {
        return n(this, void 0, void 0, function* () {
          return yield this.keplr.getEnigmaTxEncryptionKey(this.chainId, e);
        });
      }
      encrypt(e, t) {
        return n(this, void 0, void 0, function* () {
          return yield this.keplr.enigmaEncrypt(this.chainId, e, t);
        });
      }
      decrypt(e, t) {
        return n(this, void 0, void 0, function* () {
          return yield this.keplr.enigmaDecrypt(this.chainId, e, t);
        });
      }
    };
  },
  172: function (e, t, i) {
    'use strict';
    var n =
      (this && this.__awaiter) ||
      function (e, t, i, n) {
        return new (i || (i = Promise))(function (r, s) {
          function o(e) {
            try {
              h(n.next(e));
            } catch (e) {
              s(e);
            }
          }
          function u(e) {
            try {
              h(n.throw(e));
            } catch (e) {
              s(e);
            }
          }
          function h(e) {
            var t;
            e.done
              ? r(e.value)
              : ((t = e.value),
                t instanceof i
                  ? t
                  : new i(function (e) {
                      e(t);
                    })).then(o, u);
          }
          h((n = n.apply(e, t || [])).next());
        });
      };
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.CosmJSOfflineSigner = t.CosmJSOfflineSignerOnlyAmino = void 0);
    class r {
      constructor(e, t) {
        (this.chainId = e), (this.keplr = t);
      }
      getAccounts() {
        return n(this, void 0, void 0, function* () {
          const e = yield this.keplr.getKey(this.chainId);
          return [{ address: e.bech32Address, algo: 'secp256k1', pubkey: e.pubKey }];
        });
      }
      signAmino(e, t) {
        return n(this, void 0, void 0, function* () {
          if (this.chainId !== t.chain_id) throw new Error('Unmatched chain id with the offline signer');
          if ((yield this.keplr.getKey(t.chain_id)).bech32Address !== e) throw new Error('Unknown signer address');
          return yield this.keplr.signAmino(this.chainId, e, t);
        });
      }
      sign(e, t) {
        return n(this, void 0, void 0, function* () {
          return yield this.signAmino(e, t);
        });
      }
    }
    t.CosmJSOfflineSignerOnlyAmino = r;
    t.CosmJSOfflineSigner = class extends r {
      constructor(e, t) {
        super(e, t), (this.chainId = e), (this.keplr = t);
      }
      signDirect(e, t) {
        return n(this, void 0, void 0, function* () {
          if (this.chainId !== t.chainId) throw new Error('Unmatched chain id with the offline signer');
          if ((yield this.keplr.getKey(t.chainId)).bech32Address !== e) throw new Error('Unknown signer address');
          return yield this.keplr.signDirect(this.chainId, e, t);
        });
      }
    };
  },
  1753: function (e, t, i) {
    e.exports = i(1759);
  },
  1759: function (e, t, i) {
    'use strict';
    i.r(t);
    var n = i(215);
    var r = i(227);
    const s = new n.InjectedKeplr(r.version, 'extension');
    !(function (e, t, i, n, r) {
      (window.keplr = e),
        (window.getOfflineSigner = t),
        (window.getOfflineSignerOnlyAmino = i),
        (window.getOfflineSignerAuto = n),
        (window.getEnigmaUtils = r);
    })(
      s,
      (e) => s.getOfflineSigner(e),
      (e) => s.getOfflineSignerOnlyAmino(e),
      (e) => s.getOfflineSignerAuto(e),
      (e) => s.getEnigmaUtils(e),
    );
  },
  18: function (e, t, i) {
    'use strict';
    var n =
        (this && this.__createBinding) ||
        (Object.create
          ? function (e, t, i, n) {
              void 0 === n && (n = i),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[i];
                  },
                });
            }
          : function (e, t, i, n) {
              void 0 === n && (n = i), (e[n] = t[i]);
            }),
      r =
        (this && this.__exportStar) ||
        function (e, t) {
          for (var i in e) 'default' === i || Object.prototype.hasOwnProperty.call(t, i) || n(t, e, i);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }),
      r(i(265), t),
      r(i(267), t),
      r(i(268), t),
      r(i(269), t),
      r(i(270), t),
      r(i(271), t),
      r(i(160), t),
      r(i(161), t);
  },
  215: function (e, t, i) {
    'use strict';
    var n =
        (this && this.__createBinding) ||
        (Object.create
          ? function (e, t, i, n) {
              void 0 === n && (n = i),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[i];
                  },
                });
            }
          : function (e, t, i, n) {
              void 0 === n && (n = i), (e[n] = t[i]);
            }),
      r =
        (this && this.__exportStar) ||
        function (e, t) {
          for (var i in e) 'default' === i || Object.prototype.hasOwnProperty.call(t, i) || n(t, e, i);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }), r(i(536), t), r(i(172), t), r(i(171), t), r(i(539), t);
  },
  227: function (e) {
    e.exports = JSON.parse(
      '{"manifest_version":2,"name":"Keplr","description":"Keplr is a browser extension wallet for the Inter blockchain ecosystem.","version":"0.9.8","applications":{"gecko":{"id":"keplr-extension@keplr.app","strict_min_version":"56.0"}},"icons":{"16":"assets/icon-16.png","48":"assets/icon-48.png","128":"assets/icon-128.png"},"browser_action":{"default_popup":"popup.html","default_title":"Keplr"},"background":{"scripts":["browser-polyfill.js","background.bundle.js"],"persistent":true},"permissions":["storage","notifications","identity"],"content_scripts":[{"matches":["<all_urls>"],"js":["browser-polyfill.js","contentScripts.bundle.js"],"run_at":"document_start","all_frames":true}],"web_accessible_resources":["injectedScript.bundle.js","assets/temp-icon.svg"]}',
    );
  },
  265: function (e, t, i) {
    'use strict';
    var n =
      (this && this.__awaiter) ||
      function (e, t, i, n) {
        return new (i || (i = Promise))(function (r, s) {
          function o(e) {
            try {
              h(n.next(e));
            } catch (e) {
              s(e);
            }
          }
          function u(e) {
            try {
              h(n.throw(e));
            } catch (e) {
              s(e);
            }
          }
          function h(e) {
            var t;
            e.done
              ? r(e.value)
              : ((t = e.value),
                t instanceof i
                  ? t
                  : new i(function (e) {
                      e(t);
                    })).then(o, u);
          }
          h((n = n.apply(e, t || [])).next());
        });
      };
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.Router = void 0);
    const r = i(160),
      s = i(161);
    t.Router = class {
      constructor(e) {
        (this.envProducer = e),
          (this.msgRegistry = new r.MessageRegistry()),
          (this.registeredHandler = new Map()),
          (this.guards = []),
          (this.port = '');
      }
      registerMessage(e) {
        this.msgRegistry.registerMessage(e);
      }
      addHandler(e, t) {
        if (this.registeredHandler.has(e)) throw new Error('Already registered type ' + e);
        this.registeredHandler.set(e, t);
      }
      addGuard(e) {
        this.guards.push(e);
      }
      handleMessage(e, t) {
        var i;
        return n(this, void 0, void 0, function* () {
          const n = this.msgRegistry.parseMessage(s.JSONUint8Array.unwrap(e)),
            r = this.envProducer(t, null !== (i = n.routerMeta) && void 0 !== i ? i : {});
          for (const e of this.guards) yield e(r, n, t);
          n.validateBasic();
          const o = n.route();
          if (!o) throw new Error('Null router');
          const u = this.registeredHandler.get(o);
          if (!u) throw new Error("Can't get handler");
          return s.JSONUint8Array.wrap(yield u(r, n));
        });
      }
    };
  },
  266: function (e, t, i) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.fromHex = t.toHex = void 0),
      (t.toHex = function (e) {
        let t = '';
        for (const i of e) t += ('0' + i.toString(16)).slice(-2);
        return t;
      }),
      (t.fromHex = function (e) {
        if (e.length % 2 != 0) throw new Error('hex string length must be a multiple of 2');
        const t = [];
        for (let i = 0; i < e.length; i += 2) {
          const n = e.substr(i, 2);
          if (!n.match(/[0-9a-f]{2}/i)) throw new Error('hex string contains invalid characters');
          t.push(parseInt(n, 16));
        }
        return new Uint8Array(t);
      });
  },
  267: function (e, t, i) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 });
  },
  268: function (e, t, i) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 });
  },
  269: function (e, t, i) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 });
  },
  270: function (e, t, i) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.Message = void 0);
    t.Message = class {
      approveExternal(e, t) {
        return !1;
      }
    };
  },
  271: function (e, t, i) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.WEBPAGE_PORT = t.APP_PORT = t.BACKGROUND_PORT = void 0),
      (t.BACKGROUND_PORT = 'background'),
      (t.APP_PORT = 'popup'),
      (t.WEBPAGE_PORT = 'webpage');
  },
  536: function (e, t, i) {
    'use strict';
    var n =
        (this && this.__awaiter) ||
        function (e, t, i, n) {
          return new (i || (i = Promise))(function (r, s) {
            function o(e) {
              try {
                h(n.next(e));
              } catch (e) {
                s(e);
              }
            }
            function u(e) {
              try {
                h(n.throw(e));
              } catch (e) {
                s(e);
              }
            }
            function h(e) {
              var t;
              e.done
                ? r(e.value)
                : ((t = e.value),
                  t instanceof i
                    ? t
                    : new i(function (e) {
                        e(t);
                      })).then(o, u);
            }
            h((n = n.apply(e, t || [])).next());
          });
        },
      r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.Keplr = void 0);
    const s = i(18),
      o = i(537),
      u = i(171),
      h = i(172),
      a = r(i(159)),
      c = r(i(59));
    t.Keplr = class {
      constructor(e, t, i) {
        (this.version = e),
          (this.mode = t),
          (this.requester = i),
          (this.enigmaUtils = new Map()),
          (this.defaultOptions = {});
      }
      enable(e) {
        return n(this, void 0, void 0, function* () {
          'string' == typeof e && (e = [e]),
            yield this.requester.sendMessage(s.BACKGROUND_PORT, new o.EnableAccessMsg(e));
        });
      }
      experimentalSuggestChain(e) {
        return n(this, void 0, void 0, function* () {
          const t = new o.SuggestChainInfoMsg(e);
          yield this.requester.sendMessage(s.BACKGROUND_PORT, t);
        });
      }
      getKey(e) {
        return n(this, void 0, void 0, function* () {
          const t = new o.GetKeyMsg(e);
          return yield this.requester.sendMessage(s.BACKGROUND_PORT, t);
        });
      }
      sendTx(e, t, i) {
        return n(this, void 0, void 0, function* () {
          const n = new o.SendTxMsg(e, t, i);
          return yield this.requester.sendMessage(s.BACKGROUND_PORT, n);
        });
      }
      signAmino(e, t, i, r = {}) {
        var u;
        return n(this, void 0, void 0, function* () {
          const n = new o.RequestSignAminoMsg(
            e,
            t,
            i,
            a.default(null !== (u = this.defaultOptions.sign) && void 0 !== u ? u : {}, r),
          );
          return yield this.requester.sendMessage(s.BACKGROUND_PORT, n);
        });
      }
      signDirect(e, t, i, r = {}) {
        var u;
        return n(this, void 0, void 0, function* () {
          const n = new o.RequestSignDirectMsg(
              e,
              t,
              {
                bodyBytes: i.bodyBytes,
                authInfoBytes: i.authInfoBytes,
                chainId: i.chainId,
                accountNumber: i.accountNumber ? i.accountNumber.toString() : null,
              },
              a.default(null !== (u = this.defaultOptions.sign) && void 0 !== u ? u : {}, r),
            ),
            h = yield this.requester.sendMessage(s.BACKGROUND_PORT, n);
          return {
            signed: {
              bodyBytes: h.signed.bodyBytes,
              authInfoBytes: h.signed.authInfoBytes,
              chainId: h.signed.chainId,
              accountNumber: c.default.fromString(h.signed.accountNumber),
            },
            signature: h.signature,
          };
        });
      }
      getOfflineSigner(e) {
        return new h.CosmJSOfflineSigner(e, this);
      }
      getOfflineSignerOnlyAmino(e) {
        return new h.CosmJSOfflineSignerOnlyAmino(e, this);
      }
      getOfflineSignerAuto(e) {
        return n(this, void 0, void 0, function* () {
          return (yield this.getKey(e)).isNanoLedger
            ? new h.CosmJSOfflineSignerOnlyAmino(e, this)
            : new h.CosmJSOfflineSigner(e, this);
        });
      }
      suggestToken(e, t, i) {
        return n(this, void 0, void 0, function* () {
          const n = new o.SuggestTokenMsg(e, t, i);
          yield this.requester.sendMessage(s.BACKGROUND_PORT, n);
        });
      }
      getSecret20ViewingKey(e, t) {
        return n(this, void 0, void 0, function* () {
          const i = new o.GetSecret20ViewingKey(e, t);
          return yield this.requester.sendMessage(s.BACKGROUND_PORT, i);
        });
      }
      getEnigmaPubKey(e) {
        return n(this, void 0, void 0, function* () {
          return yield this.requester.sendMessage(s.BACKGROUND_PORT, new o.GetPubkeyMsg(e));
        });
      }
      getEnigmaTxEncryptionKey(e, t) {
        return n(this, void 0, void 0, function* () {
          return yield this.requester.sendMessage(s.BACKGROUND_PORT, new o.GetTxEncryptionKeyMsg(e, t));
        });
      }
      enigmaEncrypt(e, t, i) {
        return n(this, void 0, void 0, function* () {
          return yield this.requester.sendMessage(s.BACKGROUND_PORT, new o.ReqeustEncryptMsg(e, t, i));
        });
      }
      enigmaDecrypt(e, t, i) {
        return n(this, void 0, void 0, function* () {
          return t && 0 !== t.length
            ? yield this.requester.sendMessage(s.BACKGROUND_PORT, new o.RequestDecryptMsg(e, t, i))
            : new Uint8Array();
        });
      }
      getEnigmaUtils(e) {
        if (this.enigmaUtils.has(e)) return this.enigmaUtils.get(e);
        const t = new u.KeplrEnigmaUtils(e, this);
        return this.enigmaUtils.set(e, t), t;
      }
    };
  },
  537: function (e, t, i) {
    'use strict';
    var n =
        (this && this.__createBinding) ||
        (Object.create
          ? function (e, t, i, n) {
              void 0 === n && (n = i),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[i];
                  },
                });
            }
          : function (e, t, i, n) {
              void 0 === n && (n = i), (e[n] = t[i]);
            }),
      r =
        (this && this.__exportStar) ||
        function (e, t) {
          for (var i in e) 'default' === i || Object.prototype.hasOwnProperty.call(t, i) || n(t, e, i);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }), r(i(538), t);
  },
  538: function (e, t, i) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.GetTxEncryptionKeyMsg =
        t.RequestDecryptMsg =
        t.ReqeustEncryptMsg =
        t.GetPubkeyMsg =
        t.RequestSignDirectMsg =
        t.RequestSignAminoMsg =
        t.GetSecret20ViewingKey =
        t.SendTxMsg =
        t.SuggestTokenMsg =
        t.SuggestChainInfoMsg =
        t.GetKeyMsg =
        t.EnableAccessMsg =
          void 0);
    const n = i(18);
    class r extends n.Message {
      constructor(e) {
        super(), (this.chainIds = e);
      }
      static type() {
        return 'enable-access';
      }
      validateBasic() {
        if (!this.chainIds || 0 === this.chainIds.length) throw new Error('chain id not set');
      }
      route() {
        return 'permission';
      }
      type() {
        return r.type();
      }
    }
    t.EnableAccessMsg = r;
    class s extends n.Message {
      constructor(e) {
        super(), (this.chainId = e);
      }
      static type() {
        return 'get-key';
      }
      validateBasic() {
        if (!this.chainId) throw new Error('chain id not set');
      }
      route() {
        return 'keyring';
      }
      type() {
        return s.type();
      }
    }
    t.GetKeyMsg = s;
    class o extends n.Message {
      constructor(e) {
        super(), (this.chainInfo = e);
      }
      static type() {
        return 'suggest-chain-info';
      }
      validateBasic() {
        if (!this.chainInfo) throw new Error('chain info not set');
      }
      route() {
        return 'chains';
      }
      type() {
        return o.type();
      }
    }
    t.SuggestChainInfoMsg = o;
    class u extends n.Message {
      constructor(e, t, i) {
        super(), (this.chainId = e), (this.contractAddress = t), (this.viewingKey = i);
      }
      static type() {
        return 'suggest-token';
      }
      validateBasic() {
        if (!this.chainId) throw new Error('Chain id is empty');
        if (!this.contractAddress) throw new Error('Contract address is empty');
      }
      route() {
        return 'tokens';
      }
      type() {
        return u.type();
      }
    }
    t.SuggestTokenMsg = u;
    class h extends n.Message {
      constructor(e, t, i) {
        super(), (this.chainId = e), (this.tx = t), (this.mode = i);
      }
      static type() {
        return 'send-tx-to-background';
      }
      validateBasic() {
        if (!this.chainId) throw new Error('chain id is empty');
        if (!this.tx) throw new Error('tx is empty');
        if (!this.mode || ('sync' !== this.mode && 'async' !== this.mode && 'block' !== this.mode))
          throw new Error('invalid mode');
      }
      route() {
        return 'background-tx';
      }
      type() {
        return h.type();
      }
    }
    t.SendTxMsg = h;
    class a extends n.Message {
      constructor(e, t) {
        super(), (this.chainId = e), (this.contractAddress = t);
      }
      static type() {
        return 'get-secret20-viewing-key';
      }
      validateBasic() {
        if (!this.chainId) throw new Error('Chain id is empty');
        if (!this.contractAddress) throw new Error('Contract address is empty');
      }
      route() {
        return 'tokens';
      }
      type() {
        return a.type();
      }
    }
    t.GetSecret20ViewingKey = a;
    class c extends n.Message {
      constructor(e, t, i, n = {}) {
        super(), (this.chainId = e), (this.signer = t), (this.signDoc = i), (this.signOptions = n);
      }
      static type() {
        return 'request-sign-amino';
      }
      validateBasic() {
        if (!this.chainId) throw new Error('chain id not set');
        if (!this.signer) throw new Error('signer not set');
        if (this.signDoc.chain_id !== this.chainId)
          throw new Error('Chain id in the message is not matched with the requested chain id');
        if (!this.signOptions) throw new Error('Sign options are null');
      }
      route() {
        return 'keyring';
      }
      type() {
        return c.type();
      }
    }
    t.RequestSignAminoMsg = c;
    class d extends n.Message {
      constructor(e, t, i, n = {}) {
        super(), (this.chainId = e), (this.signer = t), (this.signDoc = i), (this.signOptions = n);
      }
      static type() {
        return 'request-sign-direct';
      }
      validateBasic() {
        if (!this.chainId) throw new Error('chain id not set');
        if (!this.signer) throw new Error('signer not set');
        if (!this.signOptions) throw new Error('Sign options are null');
      }
      route() {
        return 'keyring';
      }
      type() {
        return d.type();
      }
    }
    t.RequestSignDirectMsg = d;
    class g extends n.Message {
      constructor(e) {
        super(), (this.chainId = e);
      }
      static type() {
        return 'get-pubkey-msg';
      }
      validateBasic() {
        if (!this.chainId) throw new Error('chain id not set');
      }
      route() {
        return 'secret-wasm';
      }
      type() {
        return g.type();
      }
    }
    t.GetPubkeyMsg = g;
    class f extends n.Message {
      constructor(e, t, i) {
        super(), (this.chainId = e), (this.contractCodeHash = t), (this.msg = i);
      }
      static type() {
        return 'request-encrypt-msg';
      }
      validateBasic() {
        if (!this.chainId) throw new Error('chain id not set');
        if (!this.contractCodeHash) throw new Error('contract code hash not set');
        if (!this.msg) throw new Error('msg not set');
      }
      route() {
        return 'secret-wasm';
      }
      type() {
        return f.type();
      }
    }
    t.ReqeustEncryptMsg = f;
    class l extends n.Message {
      constructor(e, t, i) {
        super(), (this.chainId = e), (this.cipherText = t), (this.nonce = i);
      }
      static type() {
        return 'request-decrypt-msg';
      }
      validateBasic() {
        if (!this.chainId) throw new Error('chain id not set');
        if (!this.cipherText || 0 === this.cipherText.length) throw new Error('ciphertext not set');
        if (!this.nonce || 0 === this.nonce.length) throw new Error('nonce not set');
      }
      route() {
        return 'secret-wasm';
      }
      type() {
        return l.type();
      }
    }
    t.RequestDecryptMsg = l;
    class y extends n.Message {
      constructor(e, t) {
        super(), (this.chainId = e), (this.nonce = t);
      }
      static type() {
        return 'get-tx-encryption-key-msg';
      }
      validateBasic() {
        if (!this.chainId) throw new Error('chain id not set');
        if (!this.nonce) throw new Error('nonce is null');
      }
      route() {
        return 'secret-wasm';
      }
      type() {
        return y.type();
      }
    }
    t.GetTxEncryptionKeyMsg = y;
  },
  539: function (e, t, i) {
    'use strict';
    var n =
        (this && this.__awaiter) ||
        function (e, t, i, n) {
          return new (i || (i = Promise))(function (r, s) {
            function o(e) {
              try {
                h(n.next(e));
              } catch (e) {
                s(e);
              }
            }
            function u(e) {
              try {
                h(n.throw(e));
              } catch (e) {
                s(e);
              }
            }
            function h(e) {
              var t;
              e.done
                ? r(e.value)
                : ((t = e.value),
                  t instanceof i
                    ? t
                    : new i(function (e) {
                        e(t);
                      })).then(o, u);
            }
            h((n = n.apply(e, t || [])).next());
          });
        },
      r =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.InjectedKeplr = void 0);
    const s = i(18),
      o = i(171),
      u = i(172),
      h = r(i(159)),
      a = r(i(59));
    t.InjectedKeplr = class {
      constructor(
        e,
        t,
        i = {
          addMessageListener: (e) => window.addEventListener('message', e),
          removeMessageListener: (e) => window.removeEventListener('message', e),
          postMessage: (e) => window.postMessage(e, window.location.origin),
        },
        n,
      ) {
        (this.version = e),
          (this.mode = t),
          (this.eventListener = i),
          (this.parseMessage = n),
          (this.enigmaUtils = new Map()),
          (this.defaultOptions = {});
      }
      static startProxy(
        e,
        t = {
          addMessageListener: (e) => window.addEventListener('message', e),
          postMessage: (e) => window.postMessage(e, window.location.origin),
        },
        i,
      ) {
        t.addMessageListener((r) =>
          n(this, void 0, void 0, function* () {
            const o = i ? i(r.data) : r.data;
            if (o && 'proxy-request' === o.type)
              try {
                if (!o.id) throw new Error('Empty id');
                if ('version' === o.method) throw new Error('Version is not function');
                if ('mode' === o.method) throw new Error('Mode is not function');
                if ('defaultOptions' === o.method) throw new Error('DefaultOptions is not function');
                if (!e[o.method] || 'function' != typeof e[o.method]) throw new Error('Invalid method: ' + o.method);
                if ('getOfflineSigner' === o.method) throw new Error("GetOfflineSigner method can't be proxy request");
                if ('getOfflineSignerOnlyAmino' === o.method)
                  throw new Error("GetOfflineSignerOnlyAmino method can't be proxy request");
                if ('getOfflineSignerAuto' === o.method)
                  throw new Error("GetOfflineSignerAuto method can't be proxy request");
                if ('getEnigmaUtils' === o.method) throw new Error("GetEnigmaUtils method can't be proxy request");
                const i =
                    'signDirect' === o.method
                      ? yield (() =>
                          n(this, void 0, void 0, function* () {
                            const t = o.args[2],
                              i = yield e.signDirect(
                                o.args[0],
                                o.args[1],
                                {
                                  bodyBytes: t.bodyBytes,
                                  authInfoBytes: t.authInfoBytes,
                                  chainId: t.chainId,
                                  accountNumber: t.accountNumber ? a.default.fromString(t.accountNumber) : null,
                                },
                                o.args[2],
                              );
                            return {
                              signed: {
                                bodyBytes: i.signed.bodyBytes,
                                authInfoBytes: i.signed.authInfoBytes,
                                chainId: i.signed.chainId,
                                accountNumber: i.signed.accountNumber.toString(),
                              },
                              signature: i.signature,
                            };
                          }))()
                      : yield e[o.method](...s.JSONUint8Array.unwrap(o.args)),
                  r = { type: 'proxy-request-response', id: o.id, result: { return: s.JSONUint8Array.wrap(i) } };
                t.postMessage(r);
              } catch (e) {
                const i = { type: 'proxy-request-response', id: o.id, result: { error: e.message || e.toString() } };
                t.postMessage(i);
              }
          }),
        );
      }
      requestMethod(e, t) {
        const i = new Uint8Array(8),
          n = Array.from(crypto.getRandomValues(i))
            .map((e) => e.toString(16))
            .join(''),
          r = { type: 'proxy-request', id: n, method: e, args: s.JSONUint8Array.wrap(t) };
        return new Promise((e, t) => {
          const i = (r) => {
            const o = this.parseMessage ? this.parseMessage(r.data) : r.data;
            if (!o || 'proxy-request-response' !== o.type) return;
            if (o.id !== n) return;
            this.eventListener.removeMessageListener(i);
            const u = s.JSONUint8Array.unwrap(o.result);
            u ? (u.error ? t(new Error(u.error)) : e(u.return)) : t(new Error('Result is null'));
          };
          this.eventListener.addMessageListener(i), this.eventListener.postMessage(r);
        });
      }
      enable(e) {
        return n(this, void 0, void 0, function* () {
          yield this.requestMethod('enable', [e]);
        });
      }
      experimentalSuggestChain(e) {
        return n(this, void 0, void 0, function* () {
          yield this.requestMethod('experimentalSuggestChain', [e]);
        });
      }
      getKey(e) {
        return n(this, void 0, void 0, function* () {
          return yield this.requestMethod('getKey', [e]);
        });
      }
      sendTx(e, t, i) {
        return n(this, void 0, void 0, function* () {
          return yield this.requestMethod('sendTx', [e, t, i]);
        });
      }
      signAmino(e, t, i, r = {}) {
        var s;
        return n(this, void 0, void 0, function* () {
          return yield this.requestMethod('signAmino', [
            e,
            t,
            i,
            h.default(null !== (s = this.defaultOptions.sign) && void 0 !== s ? s : {}, r),
          ]);
        });
      }
      signDirect(e, t, i, r = {}) {
        var s;
        return n(this, void 0, void 0, function* () {
          const n = yield this.requestMethod('signDirect', [
              e,
              t,
              {
                bodyBytes: i.bodyBytes,
                authInfoBytes: i.authInfoBytes,
                chainId: i.chainId,
                accountNumber: i.accountNumber ? i.accountNumber.toString() : null,
              },
              h.default(null !== (s = this.defaultOptions.sign) && void 0 !== s ? s : {}, r),
            ]),
            o = n.signed;
          return {
            signed: {
              bodyBytes: o.bodyBytes,
              authInfoBytes: o.authInfoBytes,
              chainId: o.chainId,
              accountNumber: a.default.fromString(o.accountNumber),
            },
            signature: n.signature,
          };
        });
      }
      getOfflineSigner(e) {
        return new u.CosmJSOfflineSigner(e, this);
      }
      getOfflineSignerOnlyAmino(e) {
        return new u.CosmJSOfflineSignerOnlyAmino(e, this);
      }
      getOfflineSignerAuto(e) {
        return n(this, void 0, void 0, function* () {
          return (yield this.getKey(e)).isNanoLedger
            ? new u.CosmJSOfflineSignerOnlyAmino(e, this)
            : new u.CosmJSOfflineSigner(e, this);
        });
      }
      suggestToken(e, t, i) {
        return n(this, void 0, void 0, function* () {
          return yield this.requestMethod('suggestToken', [e, t, i]);
        });
      }
      getSecret20ViewingKey(e, t) {
        return n(this, void 0, void 0, function* () {
          return yield this.requestMethod('getSecret20ViewingKey', [e, t]);
        });
      }
      getEnigmaPubKey(e) {
        return n(this, void 0, void 0, function* () {
          return yield this.requestMethod('getEnigmaPubKey', [e]);
        });
      }
      getEnigmaTxEncryptionKey(e, t) {
        return n(this, void 0, void 0, function* () {
          return yield this.requestMethod('getEnigmaTxEncryptionKey', [e, t]);
        });
      }
      enigmaEncrypt(e, t, i) {
        return n(this, void 0, void 0, function* () {
          return yield this.requestMethod('enigmaEncrypt', [e, t, i]);
        });
      }
      enigmaDecrypt(e, t, i) {
        return n(this, void 0, void 0, function* () {
          return yield this.requestMethod('enigmaDecrypt', [e, t, i]);
        });
      }
      getEnigmaUtils(e) {
        if (this.enigmaUtils.has(e)) return this.enigmaUtils.get(e);
        const t = new o.KeplrEnigmaUtils(e, this);
        return this.enigmaUtils.set(e, t), t;
      }
    };
  },
  59: function (e, t) {
    e.exports = n;
    var i = null;
    try {
      i = new WebAssembly.Instance(
        new WebAssembly.Module(
          new Uint8Array([
            0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1,
            1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5,
            100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101,
            116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173,
            66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167,
            11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127,
            34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32,
            2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126,
            32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135,
            167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173,
            66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11,
          ]),
        ),
        {},
      ).exports;
    } catch (e) {}
    function n(e, t, i) {
      (this.low = 0 | e), (this.high = 0 | t), (this.unsigned = !!i);
    }
    function r(e) {
      return !0 === (e && e.__isLong__);
    }
    n.prototype.__isLong__, Object.defineProperty(n.prototype, '__isLong__', { value: !0 }), (n.isLong = r);
    var s = {},
      o = {};
    function u(e, t) {
      var i, n, r;
      return t
        ? (r = 0 <= (e >>>= 0) && e < 256) && (n = o[e])
          ? n
          : ((i = a(e, (0 | e) < 0 ? -1 : 0, !0)), r && (o[e] = i), i)
        : (r = -128 <= (e |= 0) && e < 128) && (n = s[e])
        ? n
        : ((i = a(e, e < 0 ? -1 : 0, !1)), r && (s[e] = i), i);
    }
    function h(e, t) {
      if (isNaN(e)) return t ? v : w;
      if (t) {
        if (e < 0) return v;
        if (e >= l) return _;
      } else {
        if (e <= -y) return E;
        if (e + 1 >= y) return M;
      }
      return e < 0 ? h(-e, t).neg() : a(e % f | 0, (e / f) | 0, t);
    }
    function a(e, t, i) {
      return new n(e, t, i);
    }
    (n.fromInt = u), (n.fromNumber = h), (n.fromBits = a);
    var c = Math.pow;
    function d(e, t, i) {
      if (0 === e.length) throw Error('empty string');
      if ('NaN' === e || 'Infinity' === e || '+Infinity' === e || '-Infinity' === e) return w;
      if (('number' == typeof t ? ((i = t), (t = !1)) : (t = !!t), (i = i || 10) < 2 || 36 < i))
        throw RangeError('radix');
      var n;
      if ((n = e.indexOf('-')) > 0) throw Error('interior hyphen');
      if (0 === n) return d(e.substring(1), t, i).neg();
      for (var r = h(c(i, 8)), s = w, o = 0; o < e.length; o += 8) {
        var u = Math.min(8, e.length - o),
          a = parseInt(e.substring(o, o + u), i);
        if (u < 8) {
          var g = h(c(i, u));
          s = s.mul(g).add(h(a));
        } else s = (s = s.mul(r)).add(h(a));
      }
      return (s.unsigned = t), s;
    }
    function g(e, t) {
      return 'number' == typeof e
        ? h(e, t)
        : 'string' == typeof e
        ? d(e, t)
        : a(e.low, e.high, 'boolean' == typeof t ? t : e.unsigned);
    }
    (n.fromString = d), (n.fromValue = g);
    var f = 4294967296,
      l = f * f,
      y = l / 2,
      p = u(1 << 24),
      w = u(0);
    n.ZERO = w;
    var v = u(0, !0);
    n.UZERO = v;
    var m = u(1);
    n.ONE = m;
    var b = u(1, !0);
    n.UONE = b;
    var O = u(-1);
    n.NEG_ONE = O;
    var M = a(-1, 2147483647, !1);
    n.MAX_VALUE = M;
    var _ = a(-1, -1, !0);
    n.MAX_UNSIGNED_VALUE = _;
    var E = a(0, -2147483648, !1);
    n.MIN_VALUE = E;
    var S = n.prototype;
    (S.toInt = function () {
      return this.unsigned ? this.low >>> 0 : this.low;
    }),
      (S.toNumber = function () {
        return this.unsigned ? (this.high >>> 0) * f + (this.low >>> 0) : this.high * f + (this.low >>> 0);
      }),
      (S.toString = function (e) {
        if ((e = e || 10) < 2 || 36 < e) throw RangeError('radix');
        if (this.isZero()) return '0';
        if (this.isNegative()) {
          if (this.eq(E)) {
            var t = h(e),
              i = this.div(t),
              n = i.mul(t).sub(this);
            return i.toString(e) + n.toInt().toString(e);
          }
          return '-' + this.neg().toString(e);
        }
        for (var r = h(c(e, 6), this.unsigned), s = this, o = ''; ; ) {
          var u = s.div(r),
            a = (s.sub(u.mul(r)).toInt() >>> 0).toString(e);
          if ((s = u).isZero()) return a + o;
          for (; a.length < 6; ) a = '0' + a;
          o = '' + a + o;
        }
      }),
      (S.getHighBits = function () {
        return this.high;
      }),
      (S.getHighBitsUnsigned = function () {
        return this.high >>> 0;
      }),
      (S.getLowBits = function () {
        return this.low;
      }),
      (S.getLowBitsUnsigned = function () {
        return this.low >>> 0;
      }),
      (S.getNumBitsAbs = function () {
        if (this.isNegative()) return this.eq(E) ? 64 : this.neg().getNumBitsAbs();
        for (var e = 0 != this.high ? this.high : this.low, t = 31; t > 0 && 0 == (e & (1 << t)); t--);
        return 0 != this.high ? t + 33 : t + 1;
      }),
      (S.isZero = function () {
        return 0 === this.high && 0 === this.low;
      }),
      (S.eqz = S.isZero),
      (S.isNegative = function () {
        return !this.unsigned && this.high < 0;
      }),
      (S.isPositive = function () {
        return this.unsigned || this.high >= 0;
      }),
      (S.isOdd = function () {
        return 1 == (1 & this.low);
      }),
      (S.isEven = function () {
        return 0 == (1 & this.low);
      }),
      (S.equals = function (e) {
        return (
          r(e) || (e = g(e)),
          (this.unsigned === e.unsigned || this.high >>> 31 != 1 || e.high >>> 31 != 1) &&
            this.high === e.high &&
            this.low === e.low
        );
      }),
      (S.eq = S.equals),
      (S.notEquals = function (e) {
        return !this.eq(e);
      }),
      (S.neq = S.notEquals),
      (S.ne = S.notEquals),
      (S.lessThan = function (e) {
        return this.comp(e) < 0;
      }),
      (S.lt = S.lessThan),
      (S.lessThanOrEqual = function (e) {
        return this.comp(e) <= 0;
      }),
      (S.lte = S.lessThanOrEqual),
      (S.le = S.lessThanOrEqual),
      (S.greaterThan = function (e) {
        return this.comp(e) > 0;
      }),
      (S.gt = S.greaterThan),
      (S.greaterThanOrEqual = function (e) {
        return this.comp(e) >= 0;
      }),
      (S.gte = S.greaterThanOrEqual),
      (S.ge = S.greaterThanOrEqual),
      (S.compare = function (e) {
        if ((r(e) || (e = g(e)), this.eq(e))) return 0;
        var t = this.isNegative(),
          i = e.isNegative();
        return t && !i
          ? -1
          : !t && i
          ? 1
          : this.unsigned
          ? e.high >>> 0 > this.high >>> 0 || (e.high === this.high && e.low >>> 0 > this.low >>> 0)
            ? -1
            : 1
          : this.sub(e).isNegative()
          ? -1
          : 1;
      }),
      (S.comp = S.compare),
      (S.negate = function () {
        return !this.unsigned && this.eq(E) ? E : this.not().add(m);
      }),
      (S.neg = S.negate),
      (S.add = function (e) {
        r(e) || (e = g(e));
        var t = this.high >>> 16,
          i = 65535 & this.high,
          n = this.low >>> 16,
          s = 65535 & this.low,
          o = e.high >>> 16,
          u = 65535 & e.high,
          h = e.low >>> 16,
          c = 0,
          d = 0,
          f = 0,
          l = 0;
        return (
          (f += (l += s + (65535 & e.low)) >>> 16),
          (d += (f += n + h) >>> 16),
          (c += (d += i + u) >>> 16),
          (c += t + o),
          a(((f &= 65535) << 16) | (l &= 65535), ((c &= 65535) << 16) | (d &= 65535), this.unsigned)
        );
      }),
      (S.subtract = function (e) {
        return r(e) || (e = g(e)), this.add(e.neg());
      }),
      (S.sub = S.subtract),
      (S.multiply = function (e) {
        if (this.isZero()) return w;
        if ((r(e) || (e = g(e)), i)) return a(i.mul(this.low, this.high, e.low, e.high), i.get_high(), this.unsigned);
        if (e.isZero()) return w;
        if (this.eq(E)) return e.isOdd() ? E : w;
        if (e.eq(E)) return this.isOdd() ? E : w;
        if (this.isNegative()) return e.isNegative() ? this.neg().mul(e.neg()) : this.neg().mul(e).neg();
        if (e.isNegative()) return this.mul(e.neg()).neg();
        if (this.lt(p) && e.lt(p)) return h(this.toNumber() * e.toNumber(), this.unsigned);
        var t = this.high >>> 16,
          n = 65535 & this.high,
          s = this.low >>> 16,
          o = 65535 & this.low,
          u = e.high >>> 16,
          c = 65535 & e.high,
          d = e.low >>> 16,
          f = 65535 & e.low,
          l = 0,
          y = 0,
          v = 0,
          m = 0;
        return (
          (v += (m += o * f) >>> 16),
          (y += (v += s * f) >>> 16),
          (v &= 65535),
          (y += (v += o * d) >>> 16),
          (l += (y += n * f) >>> 16),
          (y &= 65535),
          (l += (y += s * d) >>> 16),
          (y &= 65535),
          (l += (y += o * c) >>> 16),
          (l += t * f + n * d + s * c + o * u),
          a(((v &= 65535) << 16) | (m &= 65535), ((l &= 65535) << 16) | (y &= 65535), this.unsigned)
        );
      }),
      (S.mul = S.multiply),
      (S.divide = function (e) {
        if ((r(e) || (e = g(e)), e.isZero())) throw Error('division by zero');
        var t, n, s;
        if (i)
          return this.unsigned || -2147483648 !== this.high || -1 !== e.low || -1 !== e.high
            ? a((this.unsigned ? i.div_u : i.div_s)(this.low, this.high, e.low, e.high), i.get_high(), this.unsigned)
            : this;
        if (this.isZero()) return this.unsigned ? v : w;
        if (this.unsigned) {
          if ((e.unsigned || (e = e.toUnsigned()), e.gt(this))) return v;
          if (e.gt(this.shru(1))) return b;
          s = v;
        } else {
          if (this.eq(E))
            return e.eq(m) || e.eq(O)
              ? E
              : e.eq(E)
              ? m
              : (t = this.shr(1).div(e).shl(1)).eq(w)
              ? e.isNegative()
                ? m
                : O
              : ((n = this.sub(e.mul(t))), (s = t.add(n.div(e))));
          if (e.eq(E)) return this.unsigned ? v : w;
          if (this.isNegative()) return e.isNegative() ? this.neg().div(e.neg()) : this.neg().div(e).neg();
          if (e.isNegative()) return this.div(e.neg()).neg();
          s = w;
        }
        for (n = this; n.gte(e); ) {
          t = Math.max(1, Math.floor(n.toNumber() / e.toNumber()));
          for (
            var o = Math.ceil(Math.log(t) / Math.LN2), u = o <= 48 ? 1 : c(2, o - 48), d = h(t), f = d.mul(e);
            f.isNegative() || f.gt(n);

          )
            f = (d = h((t -= u), this.unsigned)).mul(e);
          d.isZero() && (d = m), (s = s.add(d)), (n = n.sub(f));
        }
        return s;
      }),
      (S.div = S.divide),
      (S.modulo = function (e) {
        return (
          r(e) || (e = g(e)),
          i
            ? a((this.unsigned ? i.rem_u : i.rem_s)(this.low, this.high, e.low, e.high), i.get_high(), this.unsigned)
            : this.sub(this.div(e).mul(e))
        );
      }),
      (S.mod = S.modulo),
      (S.rem = S.modulo),
      (S.not = function () {
        return a(~this.low, ~this.high, this.unsigned);
      }),
      (S.and = function (e) {
        return r(e) || (e = g(e)), a(this.low & e.low, this.high & e.high, this.unsigned);
      }),
      (S.or = function (e) {
        return r(e) || (e = g(e)), a(this.low | e.low, this.high | e.high, this.unsigned);
      }),
      (S.xor = function (e) {
        return r(e) || (e = g(e)), a(this.low ^ e.low, this.high ^ e.high, this.unsigned);
      }),
      (S.shiftLeft = function (e) {
        return (
          r(e) && (e = e.toInt()),
          0 == (e &= 63)
            ? this
            : e < 32
            ? a(this.low << e, (this.high << e) | (this.low >>> (32 - e)), this.unsigned)
            : a(0, this.low << (e - 32), this.unsigned)
        );
      }),
      (S.shl = S.shiftLeft),
      (S.shiftRight = function (e) {
        return (
          r(e) && (e = e.toInt()),
          0 == (e &= 63)
            ? this
            : e < 32
            ? a((this.low >>> e) | (this.high << (32 - e)), this.high >> e, this.unsigned)
            : a(this.high >> (e - 32), this.high >= 0 ? 0 : -1, this.unsigned)
        );
      }),
      (S.shr = S.shiftRight),
      (S.shiftRightUnsigned = function (e) {
        if ((r(e) && (e = e.toInt()), 0 === (e &= 63))) return this;
        var t = this.high;
        return e < 32
          ? a((this.low >>> e) | (t << (32 - e)), t >>> e, this.unsigned)
          : a(32 === e ? t : t >>> (e - 32), 0, this.unsigned);
      }),
      (S.shru = S.shiftRightUnsigned),
      (S.shr_u = S.shiftRightUnsigned),
      (S.toSigned = function () {
        return this.unsigned ? a(this.low, this.high, !1) : this;
      }),
      (S.toUnsigned = function () {
        return this.unsigned ? this : a(this.low, this.high, !0);
      }),
      (S.toBytes = function (e) {
        return e ? this.toBytesLE() : this.toBytesBE();
      }),
      (S.toBytesLE = function () {
        var e = this.high,
          t = this.low;
        return [
          255 & t,
          (t >>> 8) & 255,
          (t >>> 16) & 255,
          t >>> 24,
          255 & e,
          (e >>> 8) & 255,
          (e >>> 16) & 255,
          e >>> 24,
        ];
      }),
      (S.toBytesBE = function () {
        var e = this.high,
          t = this.low;
        return [
          e >>> 24,
          (e >>> 16) & 255,
          (e >>> 8) & 255,
          255 & e,
          t >>> 24,
          (t >>> 16) & 255,
          (t >>> 8) & 255,
          255 & t,
        ];
      }),
      (n.fromBytes = function (e, t, i) {
        return i ? n.fromBytesLE(e, t) : n.fromBytesBE(e, t);
      }),
      (n.fromBytesLE = function (e, t) {
        return new n(
          e[0] | (e[1] << 8) | (e[2] << 16) | (e[3] << 24),
          e[4] | (e[5] << 8) | (e[6] << 16) | (e[7] << 24),
          t,
        );
      }),
      (n.fromBytesBE = function (e, t) {
        return new n(
          (e[4] << 24) | (e[5] << 16) | (e[6] << 8) | e[7],
          (e[0] << 24) | (e[1] << 16) | (e[2] << 8) | e[3],
          t,
        );
      });
  },
});
