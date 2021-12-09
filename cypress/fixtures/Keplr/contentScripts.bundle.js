!(function (e) {
  var t = {};
  function n(r) {
    if (t[r]) return t[r].exports;
    var i = (t[r] = { i: r, l: !1, exports: {} });
    return e[r].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function (e, t, r) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
    }),
    (n.r = function (e) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    (n.t = function (e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
      var r = Object.create(null);
      if ((n.r(r), Object.defineProperty(r, 'default', { enumerable: !0, value: e }), 2 & t && 'string' != typeof e))
        for (var i in e)
          n.d(
            r,
            i,
            function (t) {
              return e[t];
            }.bind(null, i),
          );
      return r;
    }),
    (n.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return n.d(t, 'a', t), t;
    }),
    (n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ''),
    n((n.s = 1760));
})({
  136: function (e, t, n) {
    'use strict';
    var r = function (e) {
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
              return e.$$typeof === i;
            })(e)
          );
        })(e)
      );
    };
    var i = 'function' == typeof Symbol && Symbol.for ? Symbol.for('react.element') : 60103;
    function s(e, t) {
      return !1 !== t.clone && t.isMergeableObject(e) ? h(((n = e), Array.isArray(n) ? [] : {}), e, t) : e;
      var n;
    }
    function o(e, t, n) {
      return e.concat(t).map(function (e) {
        return s(e, n);
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
    function a(e, t) {
      try {
        return t in e;
      } catch (e) {
        return !1;
      }
    }
    function c(e, t, n) {
      var r = {};
      return (
        n.isMergeableObject(e) &&
          u(e).forEach(function (t) {
            r[t] = s(e[t], n);
          }),
        u(t).forEach(function (i) {
          (function (e, t) {
            return a(e, t) && !(Object.hasOwnProperty.call(e, t) && Object.propertyIsEnumerable.call(e, t));
          })(e, i) ||
            (a(e, i) && n.isMergeableObject(t[i])
              ? (r[i] = (function (e, t) {
                  if (!t.customMerge) return h;
                  var n = t.customMerge(e);
                  return 'function' == typeof n ? n : h;
                })(i, n)(e[i], t[i], n))
              : (r[i] = s(t[i], n)));
        }),
        r
      );
    }
    function h(e, t, n) {
      ((n = n || {}).arrayMerge = n.arrayMerge || o),
        (n.isMergeableObject = n.isMergeableObject || r),
        (n.cloneUnlessOtherwiseSpecified = s);
      var i = Array.isArray(t);
      return i === Array.isArray(e) ? (i ? n.arrayMerge(e, t, n) : c(e, t, n)) : s(t, n);
    }
    h.all = function (e, t) {
      if (!Array.isArray(e)) throw new Error('first argument should be an array');
      return e.reduce(function (e, n) {
        return h(e, n, t);
      }, {});
    };
    var d = h;
    e.exports = d;
  },
  160: function (e, t, n) {
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
  161: function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.JSONUint8Array = void 0);
    const r = n(266);
    class i {
      static parse(e) {
        return JSON.parse(e, (e, t) =>
          t && 'string' == typeof t && t.startsWith('__uint8array__') ? r.fromHex(t.replace('__uint8array__', '')) : t,
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
            return '__uint8array__' + r.toHex(e);
          }
          return t;
        });
      }
      static wrap(e) {
        if (void 0 !== e) return JSON.parse(i.stringify(e));
      }
      static unwrap(e) {
        if (void 0 !== e) return i.parse(JSON.stringify(e));
      }
    }
    t.JSONUint8Array = i;
  },
  170: function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.getKeplrExtensionRouterId = void 0),
      (t.getKeplrExtensionRouterId = function () {
        return (
          null == window.keplrExtensionRouterId && (window.keplrExtensionRouterId = Math.floor(1e6 * Math.random())),
          window.keplrExtensionRouterId
        );
      });
  },
  171: function (e, t, n) {
    'use strict';
    var r =
      (this && this.__awaiter) ||
      function (e, t, n, r) {
        return new (n || (n = Promise))(function (i, s) {
          function o(e) {
            try {
              a(r.next(e));
            } catch (e) {
              s(e);
            }
          }
          function u(e) {
            try {
              a(r.throw(e));
            } catch (e) {
              s(e);
            }
          }
          function a(e) {
            var t;
            e.done
              ? i(e.value)
              : ((t = e.value),
                t instanceof n
                  ? t
                  : new n(function (e) {
                      e(t);
                    })).then(o, u);
          }
          a((r = r.apply(e, t || [])).next());
        });
      };
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.KeplrEnigmaUtils = void 0);
    t.KeplrEnigmaUtils = class {
      constructor(e, t) {
        (this.chainId = e), (this.keplr = t);
      }
      getPubkey() {
        return r(this, void 0, void 0, function* () {
          return yield this.keplr.getEnigmaPubKey(this.chainId);
        });
      }
      getTxEncryptionKey(e) {
        return r(this, void 0, void 0, function* () {
          return yield this.keplr.getEnigmaTxEncryptionKey(this.chainId, e);
        });
      }
      encrypt(e, t) {
        return r(this, void 0, void 0, function* () {
          return yield this.keplr.enigmaEncrypt(this.chainId, e, t);
        });
      }
      decrypt(e, t) {
        return r(this, void 0, void 0, function* () {
          return yield this.keplr.enigmaDecrypt(this.chainId, e, t);
        });
      }
    };
  },
  172: function (e, t, n) {
    'use strict';
    var r =
      (this && this.__awaiter) ||
      function (e, t, n, r) {
        return new (n || (n = Promise))(function (i, s) {
          function o(e) {
            try {
              a(r.next(e));
            } catch (e) {
              s(e);
            }
          }
          function u(e) {
            try {
              a(r.throw(e));
            } catch (e) {
              s(e);
            }
          }
          function a(e) {
            var t;
            e.done
              ? i(e.value)
              : ((t = e.value),
                t instanceof n
                  ? t
                  : new n(function (e) {
                      e(t);
                    })).then(o, u);
          }
          a((r = r.apply(e, t || [])).next());
        });
      };
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.CosmJSOfflineSigner = t.CosmJSOfflineSignerOnlyAmino = void 0);
    class i {
      constructor(e, t) {
        (this.chainId = e), (this.keplr = t);
      }
      getAccounts() {
        return r(this, void 0, void 0, function* () {
          const e = yield this.keplr.getKey(this.chainId);
          return [{ address: e.bech32Address, algo: 'secp256k1', pubkey: e.pubKey }];
        });
      }
      signAmino(e, t) {
        return r(this, void 0, void 0, function* () {
          if (this.chainId !== t.chain_id) throw new Error('Unmatched chain id with the offline signer');
          if ((yield this.keplr.getKey(t.chain_id)).bech32Address !== e) throw new Error('Unknown signer address');
          return yield this.keplr.signAmino(this.chainId, e, t);
        });
      }
      sign(e, t) {
        return r(this, void 0, void 0, function* () {
          return yield this.signAmino(e, t);
        });
      }
    }
    t.CosmJSOfflineSignerOnlyAmino = i;
    t.CosmJSOfflineSigner = class extends i {
      constructor(e, t) {
        super(e, t), (this.chainId = e), (this.keplr = t);
      }
      signDirect(e, t) {
        return r(this, void 0, void 0, function* () {
          if (this.chainId !== t.chainId) throw new Error('Unmatched chain id with the offline signer');
          if ((yield this.keplr.getKey(t.chainId)).bech32Address !== e) throw new Error('Unknown signer address');
          return yield this.keplr.signDirect(this.chainId, e, t);
        });
      }
    };
  },
  1760: function (e, t, n) {
    e.exports = n(1766);
  },
  1766: function (e, t, n) {
    'use strict';
    n.r(t);
    var r = n(18),
      i = n(57),
      s = n(216);
    class o extends r.Message {
      constructor(e) {
        super(), (this.data = e);
      }
      static type() {
        return 'push-event-data';
      }
      validateBasic() {
        if (!this.data.type) throw new Error('Type should not be empty');
      }
      route() {
        return 'interaction-foreground';
      }
      type() {
        return o.type();
      }
    }
    var u = n(226);
    s.InjectedKeplr.startProxy(new s.Keplr(u.version, 'core', new i.InExtensionMessageRequester()));
    const a = new i.ExtensionRouter(i.ContentScriptEnv.produceEnv);
    a.addGuard(i.ContentScriptGuards.checkMessageIsInternal),
      (function (e) {
        e.registerMessage(o),
          e.addHandler('interaction-foreground', (e, t) => {
            switch (t.constructor) {
              case o:
                return void (
                  'keystore-changed' === t.data.type && window.dispatchEvent(new Event('keplr_keystorechange'))
                );
              default:
                throw new Error('Unknown msg type');
            }
          });
      })(a),
      a.listen(r.WEBPAGE_PORT);
    const c = document.head || document.documentElement,
      h = document.createElement('script');
    (h.src = browser.runtime.getURL('injectedScript.bundle.js')),
      (h.type = 'text/javascript'),
      c.insertBefore(h, c.children[0]),
      h.remove();
  },
  18: function (e, t, n) {
    'use strict';
    var r =
        (this && this.__createBinding) ||
        (Object.create
          ? function (e, t, n, r) {
              void 0 === r && (r = n),
                Object.defineProperty(e, r, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  },
                });
            }
          : function (e, t, n, r) {
              void 0 === r && (r = n), (e[r] = t[n]);
            }),
      i =
        (this && this.__exportStar) ||
        function (e, t) {
          for (var n in e) 'default' === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }),
      i(n(265), t),
      i(n(267), t),
      i(n(268), t),
      i(n(269), t),
      i(n(270), t),
      i(n(271), t),
      i(n(160), t),
      i(n(161), t);
  },
  180: function (e, t, n) {
    'use strict';
    var r =
      (this && this.__awaiter) ||
      function (e, t, n, r) {
        return new (n || (n = Promise))(function (i, s) {
          function o(e) {
            try {
              a(r.next(e));
            } catch (e) {
              s(e);
            }
          }
          function u(e) {
            try {
              a(r.throw(e));
            } catch (e) {
              s(e);
            }
          }
          function a(e) {
            var t;
            e.done
              ? i(e.value)
              : ((t = e.value),
                t instanceof n
                  ? t
                  : new n(function (e) {
                      e(t);
                    })).then(o, u);
          }
          a((r = r.apply(e, t || [])).next());
        });
      };
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.enableScroll =
        t.disableScroll =
        t.fitPopupWindow =
        t.closePopupWindow =
        t.openPopupWindow =
        t.PopupSize =
          void 0),
      (t.PopupSize = { width: 360, height: 580 });
    const i = {};
    (t.openPopupWindow = function (e, n = 'default', s = {}) {
      var o;
      return r(this, void 0, void 0, function* () {
        const r = Object.assign({ width: t.PopupSize.width, height: t.PopupSize.height, url: e, type: 'popup' }, s);
        if (void 0 !== i[n])
          try {
            const t = yield browser.windows.get(i[n], { populate: !0 });
            if (!(null === (o = null == t ? void 0 : t.tabs) || void 0 === o ? void 0 : o.length))
              throw new Error('Null window or tabs');
            {
              const n = t.tabs[0];
              if (!(null == n ? void 0 : n.id)) throw new Error('Null window or tabs');
              yield browser.tabs.update(n.id, { active: !0, url: e });
            }
          } catch (e) {
            i[n] = (yield browser.windows.create(r)).id;
          }
        else i[n] = (yield browser.windows.create(r)).id;
        if (i[n])
          try {
            yield browser.windows.update(i[n], { focused: !0 });
          } catch (e) {
            console.log('Failed to update window focus: ' + e.message);
          }
        return i[n];
      });
    }),
      (t.closePopupWindow = function (e) {
        (() => {
          r(this, void 0, void 0, function* () {
            const t = i[e];
            t && (yield browser.windows.remove(t));
          });
        })();
      }),
      (t.fitPopupWindow = function () {
        const e = window.outerWidth - window.innerWidth,
          n = window.outerHeight - window.innerHeight;
        browser.windows
          ? browser.windows.getCurrent().then((r) => {
              null != (null == r ? void 0 : r.id) &&
                browser.windows.update(r.id, { width: t.PopupSize.width + e, height: t.PopupSize.height + n });
            })
          : window.resizeTo(t.PopupSize.width + e, t.PopupSize.height + n);
      }),
      (t.disableScroll = function () {
        document.getElementsByTagName('html')[0].style.overflow = 'hidden';
      }),
      (t.enableScroll = function () {
        document.getElementsByTagName('html')[0].style.overflow = '';
      });
  },
  216: function (e, t, n) {
    'use strict';
    var r =
        (this && this.__createBinding) ||
        (Object.create
          ? function (e, t, n, r) {
              void 0 === r && (r = n),
                Object.defineProperty(e, r, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  },
                });
            }
          : function (e, t, n, r) {
              void 0 === r && (r = n), (e[r] = t[n]);
            }),
      i =
        (this && this.__exportStar) ||
        function (e, t) {
          for (var n in e) 'default' === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }), i(n(538), t), i(n(172), t), i(n(171), t), i(n(541), t);
  },
  224: function (e, t, n) {
    'use strict';
    var r =
        (this && this.__createBinding) ||
        (Object.create
          ? function (e, t, n, r) {
              void 0 === r && (r = n),
                Object.defineProperty(e, r, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  },
                });
            }
          : function (e, t, n, r) {
              void 0 === r && (r = n), (e[r] = t[n]);
            }),
      i =
        (this && this.__exportStar) ||
        function (e, t) {
          for (var n in e) 'default' === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }), i(n(530), t), i(n(531), t);
  },
  226: function (e) {
    e.exports = JSON.parse(
      '{"manifest_version":2,"name":"Keplr","description":"Keplr is a browser extension wallet for the Inter blockchain ecosystem.","version":"0.9.9","applications":{"gecko":{"id":"keplr-extension@keplr.app","strict_min_version":"56.0"}},"icons":{"16":"assets/icon-16.png","48":"assets/icon-48.png","128":"assets/icon-128.png"},"browser_action":{"default_popup":"popup.html","default_title":"Keplr"},"background":{"scripts":["browser-polyfill.js","background.bundle.js"],"persistent":true},"permissions":["storage","notifications","identity"],"content_scripts":[{"matches":["<all_urls>"],"js":["browser-polyfill.js","contentScripts.bundle.js"],"run_at":"document_start","all_frames":true}],"web_accessible_resources":["injectedScript.bundle.js","assets/temp-icon.svg"]}',
    );
  },
  265: function (e, t, n) {
    'use strict';
    var r =
      (this && this.__awaiter) ||
      function (e, t, n, r) {
        return new (n || (n = Promise))(function (i, s) {
          function o(e) {
            try {
              a(r.next(e));
            } catch (e) {
              s(e);
            }
          }
          function u(e) {
            try {
              a(r.throw(e));
            } catch (e) {
              s(e);
            }
          }
          function a(e) {
            var t;
            e.done
              ? i(e.value)
              : ((t = e.value),
                t instanceof n
                  ? t
                  : new n(function (e) {
                      e(t);
                    })).then(o, u);
          }
          a((r = r.apply(e, t || [])).next());
        });
      };
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.Router = void 0);
    const i = n(160),
      s = n(161);
    t.Router = class {
      constructor(e) {
        (this.envProducer = e),
          (this.msgRegistry = new i.MessageRegistry()),
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
        var n;
        return r(this, void 0, void 0, function* () {
          const r = this.msgRegistry.parseMessage(s.JSONUint8Array.unwrap(e)),
            i = this.envProducer(t, null !== (n = r.routerMeta) && void 0 !== n ? n : {});
          for (const e of this.guards) yield e(i, r, t);
          r.validateBasic();
          const o = r.route();
          if (!o) throw new Error('Null router');
          const u = this.registeredHandler.get(o);
          if (!u) throw new Error("Can't get handler");
          return s.JSONUint8Array.wrap(yield u(i, r));
        });
      }
    };
  },
  266: function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.fromHex = t.toHex = void 0),
      (t.toHex = function (e) {
        let t = '';
        for (const n of e) t += ('0' + n.toString(16)).slice(-2);
        return t;
      }),
      (t.fromHex = function (e) {
        if (e.length % 2 != 0) throw new Error('hex string length must be a multiple of 2');
        const t = [];
        for (let n = 0; n < e.length; n += 2) {
          const r = e.substr(n, 2);
          if (!r.match(/[0-9a-f]{2}/i)) throw new Error('hex string contains invalid characters');
          t.push(parseInt(r, 16));
        }
        return new Uint8Array(t);
      });
  },
  267: function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 });
  },
  268: function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 });
  },
  269: function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 });
  },
  270: function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.Message = void 0);
    t.Message = class {
      approveExternal(e, t) {
        return !1;
      }
    };
  },
  271: function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.WEBPAGE_PORT = t.APP_PORT = t.BACKGROUND_PORT = void 0),
      (t.BACKGROUND_PORT = 'background'),
      (t.APP_PORT = 'popup'),
      (t.WEBPAGE_PORT = 'webpage');
  },
  528: function (e, t, n) {
    'use strict';
    var r =
        (this && this.__createBinding) ||
        (Object.create
          ? function (e, t, n, r) {
              void 0 === r && (r = n),
                Object.defineProperty(e, r, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  },
                });
            }
          : function (e, t, n, r) {
              void 0 === r && (r = n), (e[r] = t[n]);
            }),
      i =
        (this && this.__exportStar) ||
        function (e, t) {
          for (var n in e) 'default' === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }), i(n(529), t);
  },
  529: function (e, t, n) {
    'use strict';
    var r =
      (this && this.__awaiter) ||
      function (e, t, n, r) {
        return new (n || (n = Promise))(function (i, s) {
          function o(e) {
            try {
              a(r.next(e));
            } catch (e) {
              s(e);
            }
          }
          function u(e) {
            try {
              a(r.throw(e));
            } catch (e) {
              s(e);
            }
          }
          function a(e) {
            var t;
            e.done
              ? i(e.value)
              : ((t = e.value),
                t instanceof n
                  ? t
                  : new n(function (e) {
                      e(t);
                    })).then(o, u);
          }
          a((r = r.apply(e, t || [])).next());
        });
      };
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.ExtensionRouter = void 0);
    const i = n(18),
      s = n(170);
    class o extends i.Router {
      constructor(e) {
        super(e),
          (this.onMessage = (e, t) => {
            var n, r;
            if (
              e.port === this.port &&
              (!(null === (r = null === (n = e.msg) || void 0 === n ? void 0 : n.routerMeta) || void 0 === r
                ? void 0
                : r.receiverRouterId) ||
                e.msg.routerMeta.receiverRouterId === s.getKeplrExtensionRouterId())
            )
              return this.onMessageHandler(e, t);
          });
      }
      listen(e) {
        if (!e) throw new Error('Empty port');
        (this.port = e), browser.runtime.onMessage.addListener(this.onMessage);
      }
      unlisten() {
        (this.port = ''), browser.runtime.onMessage.removeListener(this.onMessage);
      }
      onMessageHandler(e, t) {
        return r(this, void 0, void 0, function* () {
          try {
            return { return: yield this.handleMessage(e, t) };
          } catch (t) {
            return (
              console.log(
                `Failed to process msg ${e.type}: ${
                  (null == t ? void 0 : t.message) || (null == t ? void 0 : t.toString())
                }`,
              ),
              t
                ? Promise.resolve({ error: t.message || t.toString() })
                : Promise.resolve({ error: 'Unknown error, and error is null' })
            );
          }
        });
      }
    }
    t.ExtensionRouter = o;
  },
  530: function (e, t, n) {
    'use strict';
    var r =
      (this && this.__awaiter) ||
      function (e, t, n, r) {
        return new (n || (n = Promise))(function (i, s) {
          function o(e) {
            try {
              a(r.next(e));
            } catch (e) {
              s(e);
            }
          }
          function u(e) {
            try {
              a(r.throw(e));
            } catch (e) {
              s(e);
            }
          }
          function a(e) {
            var t;
            e.done
              ? i(e.value)
              : ((t = e.value),
                t instanceof n
                  ? t
                  : new n(function (e) {
                      e(t);
                    })).then(o, u);
          }
          a((r = r.apply(e, t || [])).next());
        });
      };
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.InExtensionMessageRequester = void 0);
    const i = n(18),
      s = n(170);
    t.InExtensionMessageRequester = class {
      sendMessage(e, t) {
        return r(this, void 0, void 0, function* () {
          t.validateBasic(),
            (t.origin = window.location.origin),
            (t.routerMeta = Object.assign(Object.assign({}, t.routerMeta), {
              routerId: s.getKeplrExtensionRouterId(),
            }));
          const n = i.JSONUint8Array.unwrap(
            yield browser.runtime.sendMessage({ port: e, type: t.type(), msg: i.JSONUint8Array.wrap(t) }),
          );
          if (!n) throw new Error('Null result');
          if (n.error) throw new Error(n.error);
          return n.return;
        });
      }
      static sendMessageToTab(e, t, n) {
        return r(this, void 0, void 0, function* () {
          n.validateBasic(),
            (n.origin = window.location.origin),
            (n.routerMeta = Object.assign(Object.assign({}, n.routerMeta), {
              routerId: s.getKeplrExtensionRouterId(),
            }));
          const r = i.JSONUint8Array.unwrap(
            yield browser.tabs.sendMessage(e, { port: t, type: n.type(), msg: i.JSONUint8Array.wrap(n) }),
          );
          if (!r) throw new Error('Null result');
          if (r.error) throw new Error(r.error);
          return r.return;
        });
      }
    };
  },
  531: function (e, t, n) {
    'use strict';
    var r =
      (this && this.__awaiter) ||
      function (e, t, n, r) {
        return new (n || (n = Promise))(function (i, s) {
          function o(e) {
            try {
              a(r.next(e));
            } catch (e) {
              s(e);
            }
          }
          function u(e) {
            try {
              a(r.throw(e));
            } catch (e) {
              s(e);
            }
          }
          function a(e) {
            var t;
            e.done
              ? i(e.value)
              : ((t = e.value),
                t instanceof n
                  ? t
                  : new n(function (e) {
                      e(t);
                    })).then(o, u);
          }
          a((r = r.apply(e, t || [])).next());
        });
      };
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.ContentScriptMessageRequester = void 0);
    const i = n(18),
      s = n(170);
    t.ContentScriptMessageRequester = class {
      sendMessage(e, t) {
        return r(this, void 0, void 0, function* () {
          t.validateBasic(),
            (t.origin = window.location.origin),
            (t.routerMeta = Object.assign(Object.assign({}, t.routerMeta), {
              routerId: s.getKeplrExtensionRouterId(),
            }));
          const n = i.JSONUint8Array.wrap(t),
            r = yield browser.tabs.query({ discarded: !1, status: 'complete' });
          for (let i = 0; i < r.length; i++) {
            const s = r[i].id;
            if (s)
              try {
                yield browser.tabs.sendMessage(s, { port: e, type: t.type(), msg: n });
              } catch (e) {}
          }
        });
      }
    };
  },
  532: function (e, t, n) {
    'use strict';
    var r =
        (this && this.__createBinding) ||
        (Object.create
          ? function (e, t, n, r) {
              void 0 === r && (r = n),
                Object.defineProperty(e, r, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  },
                });
            }
          : function (e, t, n, r) {
              void 0 === r && (r = n), (e[r] = t[n]);
            }),
      i =
        (this && this.__exportStar) ||
        function (e, t) {
          for (var n in e) 'default' === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }), i(n(533), t), i(n(534), t);
  },
  533: function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.ExtensionGuards = void 0);
    class r {}
    (t.ExtensionGuards = r),
      (r.checkOriginIsValid = (e, t, n) => {
        if (!n.url) throw new Error('url is empty');
        if (!t.origin) throw new Error('origin is empty');
        if (new URL(n.url).origin !== t.origin) throw new Error('Invalid origin');
        return Promise.resolve();
      }),
      (r.checkMessageIsInternal = (e, t, n) => {
        if (!e.isInternalMsg && !t.approveExternal(e, n)) throw new Error('Permission rejected');
        return Promise.resolve();
      });
  },
  534: function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.ContentScriptGuards = void 0);
    class r {}
    (t.ContentScriptGuards = r),
      (r.checkMessageIsInternal = (e, t, n) => {
        if (!e.isInternalMsg || t.approveExternal(e, n))
          throw new Error("Content script can't handle the message that is able to be sent from external");
        return Promise.resolve();
      });
  },
  535: function (e, t, n) {
    'use strict';
    var r =
        (this && this.__createBinding) ||
        (Object.create
          ? function (e, t, n, r) {
              void 0 === r && (r = n),
                Object.defineProperty(e, r, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  },
                });
            }
          : function (e, t, n, r) {
              void 0 === r && (r = n), (e[r] = t[n]);
            }),
      i =
        (this && this.__exportStar) ||
        function (e, t) {
          for (var n in e) 'default' === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }), i(n(536), t), i(n(537), t);
  },
  536: function (e, t, n) {
    'use strict';
    var r =
      (this && this.__awaiter) ||
      function (e, t, n, r) {
        return new (n || (n = Promise))(function (i, s) {
          function o(e) {
            try {
              a(r.next(e));
            } catch (e) {
              s(e);
            }
          }
          function u(e) {
            try {
              a(r.throw(e));
            } catch (e) {
              s(e);
            }
          }
          function a(e) {
            var t;
            e.done
              ? i(e.value)
              : ((t = e.value),
                t instanceof n
                  ? t
                  : new n(function (e) {
                      e(t);
                    })).then(o, u);
          }
          a((r = r.apply(e, t || [])).next());
        });
      };
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.ExtensionEnv = void 0);
    const i = n(18),
      s = n(180),
      o = n(224);
    const u = new (class {
      constructor() {
        (this.workingOnPromise = !1), (this.queue = []);
      }
      enqueue(e) {
        return new Promise((t, n) => {
          this.queue.push({ fn: e, resolve: t, reject: n }), this.dequeue();
        });
      }
      dequeue() {
        if (this.workingOnPromise) return;
        const e = this.queue.shift();
        e &&
          ((this.workingOnPromise = !0),
          e
            .fn()
            .then((t) => {
              e.resolve(t);
            })
            .catch((t) => {
              e.reject(t);
            })
            .finally(() => {
              (this.workingOnPromise = !1), this.dequeue();
            }));
      }
    })();
    class a {}
    (t.ExtensionEnv = a),
      (a.produceEnv = (e, t) => {
        const n = a.checkIsInternalMessage(e, browser.runtime.id, browser.runtime.getURL('/')),
          c = 'interaction=true&interactionInternal=' + n,
          h = (e, t, n) =>
            r(void 0, void 0, void 0, function* () {
              e.startsWith('/') && (e = e.slice(1)),
                (e = browser.runtime.getURL('/popup.html#/' + e)).includes('?') ? (e += '&' + c) : (e += '?' + c);
              const a = yield (function (e, t = 'default') {
                  return r(this, void 0, void 0, function* () {
                    return yield u.enqueue(() => s.openPopupWindow(e, t));
                  });
                })(e, null == n ? void 0 : n.channel),
                h = (yield browser.windows.get(a, { populate: !0 })).tabs[0].id;
              return (
                yield r(void 0, void 0, void 0, function* () {
                  if ('complete' !== (yield browser.tabs.get(h)).status)
                    return new Promise((e) => {
                      browser.tabs.onUpdated.addListener((t, n) => {
                        h === t && 'complete' === n.status && e();
                      });
                    });
                }),
                yield o.InExtensionMessageRequester.sendMessageToTab(h, i.APP_PORT, t)
              );
            });
        if (n) {
          return {
            isInternalMsg: n,
            requestInteraction: (n, s, u) =>
              r(void 0, void 0, void 0, function* () {
                var r;
                if (null == u ? void 0 : u.forceOpenWindow) return yield h(n, s, u);
                n.startsWith('/') && (n = n.slice(1)),
                  (n = browser.runtime.getURL('/popup.html#/' + n)).includes('?') ? (n += '&' + c) : (n += '?' + c);
                const a = yield browser.runtime.getBackgroundPage(),
                  d = browser.extension
                    .getViews({ tabId: null === (r = e.tab) || void 0 === r ? void 0 : r.id })
                    .filter(
                      (e) =>
                        e.location.href !== a.location.href &&
                        (null == t.routerId || t.routerId === e.keplrExtensionRouterId),
                    );
                if (d.length > 0) for (const e of d) e.location.href = n;
                return (
                  (s.routerMeta = Object.assign(Object.assign({}, s.routerMeta), { receiverRouterId: t.routerId })),
                  yield new o.InExtensionMessageRequester().sendMessage(i.APP_PORT, s)
                );
              }),
          };
        }
        return { isInternalMsg: n, requestInteraction: h };
      }),
      (a.checkIsInternalMessage = (e, t, n) => {
        if (!e.url) throw new Error('Empty sender url');
        const r = new URL(e.url);
        if (!r.origin || 'null' === r.origin) throw new Error('Invalid sender url');
        const i = new URL(n);
        if (!i.origin || 'null' === i.origin) throw new Error('Invalid browser url');
        return r.origin === i.origin && e.id === t;
      });
  },
  537: function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.ContentScriptEnv = void 0);
    class r {}
    (t.ContentScriptEnv = r),
      (r.produceEnv = (e) => ({
        isInternalMsg: e.id === browser.runtime.id,
        requestInteraction: () => {
          throw new Error("ContentScriptEnv doesn't support `requestInteraction`");
        },
      }));
  },
  538: function (e, t, n) {
    'use strict';
    var r =
        (this && this.__awaiter) ||
        function (e, t, n, r) {
          return new (n || (n = Promise))(function (i, s) {
            function o(e) {
              try {
                a(r.next(e));
              } catch (e) {
                s(e);
              }
            }
            function u(e) {
              try {
                a(r.throw(e));
              } catch (e) {
                s(e);
              }
            }
            function a(e) {
              var t;
              e.done
                ? i(e.value)
                : ((t = e.value),
                  t instanceof n
                    ? t
                    : new n(function (e) {
                        e(t);
                      })).then(o, u);
            }
            a((r = r.apply(e, t || [])).next());
          });
        },
      i =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.Keplr = void 0);
    const s = n(18),
      o = n(539),
      u = n(171),
      a = n(172),
      c = i(n(136)),
      h = i(n(59));
    t.Keplr = class {
      constructor(e, t, n) {
        (this.version = e),
          (this.mode = t),
          (this.requester = n),
          (this.enigmaUtils = new Map()),
          (this.defaultOptions = {});
      }
      enable(e) {
        return r(this, void 0, void 0, function* () {
          'string' == typeof e && (e = [e]),
            yield this.requester.sendMessage(s.BACKGROUND_PORT, new o.EnableAccessMsg(e));
        });
      }
      experimentalSuggestChain(e) {
        return r(this, void 0, void 0, function* () {
          const t = new o.SuggestChainInfoMsg(e);
          yield this.requester.sendMessage(s.BACKGROUND_PORT, t);
        });
      }
      getKey(e) {
        return r(this, void 0, void 0, function* () {
          const t = new o.GetKeyMsg(e);
          return yield this.requester.sendMessage(s.BACKGROUND_PORT, t);
        });
      }
      sendTx(e, t, n) {
        return r(this, void 0, void 0, function* () {
          const r = new o.SendTxMsg(e, t, n);
          return yield this.requester.sendMessage(s.BACKGROUND_PORT, r);
        });
      }
      signAmino(e, t, n, i = {}) {
        var u;
        return r(this, void 0, void 0, function* () {
          const r = new o.RequestSignAminoMsg(
            e,
            t,
            n,
            c.default(null !== (u = this.defaultOptions.sign) && void 0 !== u ? u : {}, i),
          );
          return yield this.requester.sendMessage(s.BACKGROUND_PORT, r);
        });
      }
      signDirect(e, t, n, i = {}) {
        var u;
        return r(this, void 0, void 0, function* () {
          const r = new o.RequestSignDirectMsg(
              e,
              t,
              {
                bodyBytes: n.bodyBytes,
                authInfoBytes: n.authInfoBytes,
                chainId: n.chainId,
                accountNumber: n.accountNumber ? n.accountNumber.toString() : null,
              },
              c.default(null !== (u = this.defaultOptions.sign) && void 0 !== u ? u : {}, i),
            ),
            a = yield this.requester.sendMessage(s.BACKGROUND_PORT, r);
          return {
            signed: {
              bodyBytes: a.signed.bodyBytes,
              authInfoBytes: a.signed.authInfoBytes,
              chainId: a.signed.chainId,
              accountNumber: h.default.fromString(a.signed.accountNumber),
            },
            signature: a.signature,
          };
        });
      }
      getOfflineSigner(e) {
        return new a.CosmJSOfflineSigner(e, this);
      }
      getOfflineSignerOnlyAmino(e) {
        return new a.CosmJSOfflineSignerOnlyAmino(e, this);
      }
      getOfflineSignerAuto(e) {
        return r(this, void 0, void 0, function* () {
          return (yield this.getKey(e)).isNanoLedger
            ? new a.CosmJSOfflineSignerOnlyAmino(e, this)
            : new a.CosmJSOfflineSigner(e, this);
        });
      }
      suggestToken(e, t, n) {
        return r(this, void 0, void 0, function* () {
          const r = new o.SuggestTokenMsg(e, t, n);
          yield this.requester.sendMessage(s.BACKGROUND_PORT, r);
        });
      }
      getSecret20ViewingKey(e, t) {
        return r(this, void 0, void 0, function* () {
          const n = new o.GetSecret20ViewingKey(e, t);
          return yield this.requester.sendMessage(s.BACKGROUND_PORT, n);
        });
      }
      getEnigmaPubKey(e) {
        return r(this, void 0, void 0, function* () {
          return yield this.requester.sendMessage(s.BACKGROUND_PORT, new o.GetPubkeyMsg(e));
        });
      }
      getEnigmaTxEncryptionKey(e, t) {
        return r(this, void 0, void 0, function* () {
          return yield this.requester.sendMessage(s.BACKGROUND_PORT, new o.GetTxEncryptionKeyMsg(e, t));
        });
      }
      enigmaEncrypt(e, t, n) {
        return r(this, void 0, void 0, function* () {
          return yield this.requester.sendMessage(s.BACKGROUND_PORT, new o.ReqeustEncryptMsg(e, t, n));
        });
      }
      enigmaDecrypt(e, t, n) {
        return r(this, void 0, void 0, function* () {
          return t && 0 !== t.length
            ? yield this.requester.sendMessage(s.BACKGROUND_PORT, new o.RequestDecryptMsg(e, t, n))
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
  539: function (e, t, n) {
    'use strict';
    var r =
        (this && this.__createBinding) ||
        (Object.create
          ? function (e, t, n, r) {
              void 0 === r && (r = n),
                Object.defineProperty(e, r, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  },
                });
            }
          : function (e, t, n, r) {
              void 0 === r && (r = n), (e[r] = t[n]);
            }),
      i =
        (this && this.__exportStar) ||
        function (e, t) {
          for (var n in e) 'default' === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }), i(n(540), t);
  },
  540: function (e, t, n) {
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
    const r = n(18);
    class i extends r.Message {
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
        return i.type();
      }
    }
    t.EnableAccessMsg = i;
    class s extends r.Message {
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
    class o extends r.Message {
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
    class u extends r.Message {
      constructor(e, t, n) {
        super(), (this.chainId = e), (this.contractAddress = t), (this.viewingKey = n);
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
    class a extends r.Message {
      constructor(e, t, n) {
        super(), (this.chainId = e), (this.tx = t), (this.mode = n);
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
        return a.type();
      }
    }
    t.SendTxMsg = a;
    class c extends r.Message {
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
        return c.type();
      }
    }
    t.GetSecret20ViewingKey = c;
    class h extends r.Message {
      constructor(e, t, n, r = {}) {
        super(), (this.chainId = e), (this.signer = t), (this.signDoc = n), (this.signOptions = r);
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
        return h.type();
      }
    }
    t.RequestSignAminoMsg = h;
    class d extends r.Message {
      constructor(e, t, n, r = {}) {
        super(), (this.chainId = e), (this.signer = t), (this.signDoc = n), (this.signOptions = r);
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
    class l extends r.Message {
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
        return l.type();
      }
    }
    t.GetPubkeyMsg = l;
    class g extends r.Message {
      constructor(e, t, n) {
        super(), (this.chainId = e), (this.contractCodeHash = t), (this.msg = n);
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
        return g.type();
      }
    }
    t.ReqeustEncryptMsg = g;
    class f extends r.Message {
      constructor(e, t, n) {
        super(), (this.chainId = e), (this.cipherText = t), (this.nonce = n);
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
        return f.type();
      }
    }
    t.RequestDecryptMsg = f;
    class p extends r.Message {
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
        return p.type();
      }
    }
    t.GetTxEncryptionKeyMsg = p;
  },
  541: function (e, t, n) {
    'use strict';
    var r =
        (this && this.__awaiter) ||
        function (e, t, n, r) {
          return new (n || (n = Promise))(function (i, s) {
            function o(e) {
              try {
                a(r.next(e));
              } catch (e) {
                s(e);
              }
            }
            function u(e) {
              try {
                a(r.throw(e));
              } catch (e) {
                s(e);
              }
            }
            function a(e) {
              var t;
              e.done
                ? i(e.value)
                : ((t = e.value),
                  t instanceof n
                    ? t
                    : new n(function (e) {
                        e(t);
                      })).then(o, u);
            }
            a((r = r.apply(e, t || [])).next());
          });
        },
      i =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.InjectedKeplr = void 0);
    const s = n(18),
      o = n(171),
      u = n(172),
      a = i(n(136)),
      c = i(n(59));
    t.InjectedKeplr = class {
      constructor(
        e,
        t,
        n = {
          addMessageListener: (e) => window.addEventListener('message', e),
          removeMessageListener: (e) => window.removeEventListener('message', e),
          postMessage: (e) => window.postMessage(e, window.location.origin),
        },
        r,
      ) {
        (this.version = e),
          (this.mode = t),
          (this.eventListener = n),
          (this.parseMessage = r),
          (this.enigmaUtils = new Map()),
          (this.defaultOptions = {});
      }
      static startProxy(
        e,
        t = {
          addMessageListener: (e) => window.addEventListener('message', e),
          postMessage: (e) => window.postMessage(e, window.location.origin),
        },
        n,
      ) {
        t.addMessageListener((i) =>
          r(this, void 0, void 0, function* () {
            const o = n ? n(i.data) : i.data;
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
                const n =
                    'signDirect' === o.method
                      ? yield (() =>
                          r(this, void 0, void 0, function* () {
                            const t = o.args[2],
                              n = yield e.signDirect(
                                o.args[0],
                                o.args[1],
                                {
                                  bodyBytes: t.bodyBytes,
                                  authInfoBytes: t.authInfoBytes,
                                  chainId: t.chainId,
                                  accountNumber: t.accountNumber ? c.default.fromString(t.accountNumber) : null,
                                },
                                o.args[3],
                              );
                            return {
                              signed: {
                                bodyBytes: n.signed.bodyBytes,
                                authInfoBytes: n.signed.authInfoBytes,
                                chainId: n.signed.chainId,
                                accountNumber: n.signed.accountNumber.toString(),
                              },
                              signature: n.signature,
                            };
                          }))()
                      : yield e[o.method](...s.JSONUint8Array.unwrap(o.args)),
                  i = { type: 'proxy-request-response', id: o.id, result: { return: s.JSONUint8Array.wrap(n) } };
                t.postMessage(i);
              } catch (e) {
                const n = { type: 'proxy-request-response', id: o.id, result: { error: e.message || e.toString() } };
                t.postMessage(n);
              }
          }),
        );
      }
      requestMethod(e, t) {
        const n = new Uint8Array(8),
          r = Array.from(crypto.getRandomValues(n))
            .map((e) => e.toString(16))
            .join(''),
          i = { type: 'proxy-request', id: r, method: e, args: s.JSONUint8Array.wrap(t) };
        return new Promise((e, t) => {
          const n = (i) => {
            const o = this.parseMessage ? this.parseMessage(i.data) : i.data;
            if (!o || 'proxy-request-response' !== o.type) return;
            if (o.id !== r) return;
            this.eventListener.removeMessageListener(n);
            const u = s.JSONUint8Array.unwrap(o.result);
            u ? (u.error ? t(new Error(u.error)) : e(u.return)) : t(new Error('Result is null'));
          };
          this.eventListener.addMessageListener(n), this.eventListener.postMessage(i);
        });
      }
      enable(e) {
        return r(this, void 0, void 0, function* () {
          yield this.requestMethod('enable', [e]);
        });
      }
      experimentalSuggestChain(e) {
        return r(this, void 0, void 0, function* () {
          yield this.requestMethod('experimentalSuggestChain', [e]);
        });
      }
      getKey(e) {
        return r(this, void 0, void 0, function* () {
          return yield this.requestMethod('getKey', [e]);
        });
      }
      sendTx(e, t, n) {
        return r(this, void 0, void 0, function* () {
          return yield this.requestMethod('sendTx', [e, t, n]);
        });
      }
      signAmino(e, t, n, i = {}) {
        var s;
        return r(this, void 0, void 0, function* () {
          return yield this.requestMethod('signAmino', [
            e,
            t,
            n,
            a.default(null !== (s = this.defaultOptions.sign) && void 0 !== s ? s : {}, i),
          ]);
        });
      }
      signDirect(e, t, n, i = {}) {
        var s;
        return r(this, void 0, void 0, function* () {
          const r = yield this.requestMethod('signDirect', [
              e,
              t,
              {
                bodyBytes: n.bodyBytes,
                authInfoBytes: n.authInfoBytes,
                chainId: n.chainId,
                accountNumber: n.accountNumber ? n.accountNumber.toString() : null,
              },
              a.default(null !== (s = this.defaultOptions.sign) && void 0 !== s ? s : {}, i),
            ]),
            o = r.signed;
          return {
            signed: {
              bodyBytes: o.bodyBytes,
              authInfoBytes: o.authInfoBytes,
              chainId: o.chainId,
              accountNumber: c.default.fromString(o.accountNumber),
            },
            signature: r.signature,
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
        return r(this, void 0, void 0, function* () {
          return (yield this.getKey(e)).isNanoLedger
            ? new u.CosmJSOfflineSignerOnlyAmino(e, this)
            : new u.CosmJSOfflineSigner(e, this);
        });
      }
      suggestToken(e, t, n) {
        return r(this, void 0, void 0, function* () {
          return yield this.requestMethod('suggestToken', [e, t, n]);
        });
      }
      getSecret20ViewingKey(e, t) {
        return r(this, void 0, void 0, function* () {
          return yield this.requestMethod('getSecret20ViewingKey', [e, t]);
        });
      }
      getEnigmaPubKey(e) {
        return r(this, void 0, void 0, function* () {
          return yield this.requestMethod('getEnigmaPubKey', [e]);
        });
      }
      getEnigmaTxEncryptionKey(e, t) {
        return r(this, void 0, void 0, function* () {
          return yield this.requestMethod('getEnigmaTxEncryptionKey', [e, t]);
        });
      }
      enigmaEncrypt(e, t, n) {
        return r(this, void 0, void 0, function* () {
          return yield this.requestMethod('enigmaEncrypt', [e, t, n]);
        });
      }
      enigmaDecrypt(e, t, n) {
        return r(this, void 0, void 0, function* () {
          return yield this.requestMethod('enigmaDecrypt', [e, t, n]);
        });
      }
      getEnigmaUtils(e) {
        if (this.enigmaUtils.has(e)) return this.enigmaUtils.get(e);
        const t = new o.KeplrEnigmaUtils(e, this);
        return this.enigmaUtils.set(e, t), t;
      }
    };
  },
  57: function (e, t, n) {
    'use strict';
    var r =
        (this && this.__createBinding) ||
        (Object.create
          ? function (e, t, n, r) {
              void 0 === r && (r = n),
                Object.defineProperty(e, r, {
                  enumerable: !0,
                  get: function () {
                    return t[n];
                  },
                });
            }
          : function (e, t, n, r) {
              void 0 === r && (r = n), (e[r] = t[n]);
            }),
      i =
        (this && this.__exportStar) ||
        function (e, t) {
          for (var n in e) 'default' === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n);
        };
    Object.defineProperty(t, '__esModule', { value: !0 }), i(n(528), t), i(n(224), t), i(n(532), t), i(n(535), t);
  },
  59: function (e, t) {
    e.exports = r;
    var n = null;
    try {
      n = new WebAssembly.Instance(
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
    function r(e, t, n) {
      (this.low = 0 | e), (this.high = 0 | t), (this.unsigned = !!n);
    }
    function i(e) {
      return !0 === (e && e.__isLong__);
    }
    r.prototype.__isLong__, Object.defineProperty(r.prototype, '__isLong__', { value: !0 }), (r.isLong = i);
    var s = {},
      o = {};
    function u(e, t) {
      var n, r, i;
      return t
        ? (i = 0 <= (e >>>= 0) && e < 256) && (r = o[e])
          ? r
          : ((n = c(e, (0 | e) < 0 ? -1 : 0, !0)), i && (o[e] = n), n)
        : (i = -128 <= (e |= 0) && e < 128) && (r = s[e])
        ? r
        : ((n = c(e, e < 0 ? -1 : 0, !1)), i && (s[e] = n), n);
    }
    function a(e, t) {
      if (isNaN(e)) return t ? v : w;
      if (t) {
        if (e < 0) return v;
        if (e >= f) return _;
      } else {
        if (e <= -p) return E;
        if (e + 1 >= p) return M;
      }
      return e < 0 ? a(-e, t).neg() : c(e % g | 0, (e / g) | 0, t);
    }
    function c(e, t, n) {
      return new r(e, t, n);
    }
    (r.fromInt = u), (r.fromNumber = a), (r.fromBits = c);
    var h = Math.pow;
    function d(e, t, n) {
      if (0 === e.length) throw Error('empty string');
      if ('NaN' === e || 'Infinity' === e || '+Infinity' === e || '-Infinity' === e) return w;
      if (('number' == typeof t ? ((n = t), (t = !1)) : (t = !!t), (n = n || 10) < 2 || 36 < n))
        throw RangeError('radix');
      var r;
      if ((r = e.indexOf('-')) > 0) throw Error('interior hyphen');
      if (0 === r) return d(e.substring(1), t, n).neg();
      for (var i = a(h(n, 8)), s = w, o = 0; o < e.length; o += 8) {
        var u = Math.min(8, e.length - o),
          c = parseInt(e.substring(o, o + u), n);
        if (u < 8) {
          var l = a(h(n, u));
          s = s.mul(l).add(a(c));
        } else s = (s = s.mul(i)).add(a(c));
      }
      return (s.unsigned = t), s;
    }
    function l(e, t) {
      return 'number' == typeof e
        ? a(e, t)
        : 'string' == typeof e
        ? d(e, t)
        : c(e.low, e.high, 'boolean' == typeof t ? t : e.unsigned);
    }
    (r.fromString = d), (r.fromValue = l);
    var g = 4294967296,
      f = g * g,
      p = f / 2,
      y = u(1 << 24),
      w = u(0);
    r.ZERO = w;
    var v = u(0, !0);
    r.UZERO = v;
    var m = u(1);
    r.ONE = m;
    var b = u(1, !0);
    r.UONE = b;
    var O = u(-1);
    r.NEG_ONE = O;
    var M = c(-1, 2147483647, !1);
    r.MAX_VALUE = M;
    var _ = c(-1, -1, !0);
    r.MAX_UNSIGNED_VALUE = _;
    var E = c(0, -2147483648, !1);
    r.MIN_VALUE = E;
    var S = r.prototype;
    (S.toInt = function () {
      return this.unsigned ? this.low >>> 0 : this.low;
    }),
      (S.toNumber = function () {
        return this.unsigned ? (this.high >>> 0) * g + (this.low >>> 0) : this.high * g + (this.low >>> 0);
      }),
      (S.toString = function (e) {
        if ((e = e || 10) < 2 || 36 < e) throw RangeError('radix');
        if (this.isZero()) return '0';
        if (this.isNegative()) {
          if (this.eq(E)) {
            var t = a(e),
              n = this.div(t),
              r = n.mul(t).sub(this);
            return n.toString(e) + r.toInt().toString(e);
          }
          return '-' + this.neg().toString(e);
        }
        for (var i = a(h(e, 6), this.unsigned), s = this, o = ''; ; ) {
          var u = s.div(i),
            c = (s.sub(u.mul(i)).toInt() >>> 0).toString(e);
          if ((s = u).isZero()) return c + o;
          for (; c.length < 6; ) c = '0' + c;
          o = '' + c + o;
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
          i(e) || (e = l(e)),
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
        if ((i(e) || (e = l(e)), this.eq(e))) return 0;
        var t = this.isNegative(),
          n = e.isNegative();
        return t && !n
          ? -1
          : !t && n
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
        i(e) || (e = l(e));
        var t = this.high >>> 16,
          n = 65535 & this.high,
          r = this.low >>> 16,
          s = 65535 & this.low,
          o = e.high >>> 16,
          u = 65535 & e.high,
          a = e.low >>> 16,
          h = 0,
          d = 0,
          g = 0,
          f = 0;
        return (
          (g += (f += s + (65535 & e.low)) >>> 16),
          (d += (g += r + a) >>> 16),
          (h += (d += n + u) >>> 16),
          (h += t + o),
          c(((g &= 65535) << 16) | (f &= 65535), ((h &= 65535) << 16) | (d &= 65535), this.unsigned)
        );
      }),
      (S.subtract = function (e) {
        return i(e) || (e = l(e)), this.add(e.neg());
      }),
      (S.sub = S.subtract),
      (S.multiply = function (e) {
        if (this.isZero()) return w;
        if ((i(e) || (e = l(e)), n)) return c(n.mul(this.low, this.high, e.low, e.high), n.get_high(), this.unsigned);
        if (e.isZero()) return w;
        if (this.eq(E)) return e.isOdd() ? E : w;
        if (e.eq(E)) return this.isOdd() ? E : w;
        if (this.isNegative()) return e.isNegative() ? this.neg().mul(e.neg()) : this.neg().mul(e).neg();
        if (e.isNegative()) return this.mul(e.neg()).neg();
        if (this.lt(y) && e.lt(y)) return a(this.toNumber() * e.toNumber(), this.unsigned);
        var t = this.high >>> 16,
          r = 65535 & this.high,
          s = this.low >>> 16,
          o = 65535 & this.low,
          u = e.high >>> 16,
          h = 65535 & e.high,
          d = e.low >>> 16,
          g = 65535 & e.low,
          f = 0,
          p = 0,
          v = 0,
          m = 0;
        return (
          (v += (m += o * g) >>> 16),
          (p += (v += s * g) >>> 16),
          (v &= 65535),
          (p += (v += o * d) >>> 16),
          (f += (p += r * g) >>> 16),
          (p &= 65535),
          (f += (p += s * d) >>> 16),
          (p &= 65535),
          (f += (p += o * h) >>> 16),
          (f += t * g + r * d + s * h + o * u),
          c(((v &= 65535) << 16) | (m &= 65535), ((f &= 65535) << 16) | (p &= 65535), this.unsigned)
        );
      }),
      (S.mul = S.multiply),
      (S.divide = function (e) {
        if ((i(e) || (e = l(e)), e.isZero())) throw Error('division by zero');
        var t, r, s;
        if (n)
          return this.unsigned || -2147483648 !== this.high || -1 !== e.low || -1 !== e.high
            ? c((this.unsigned ? n.div_u : n.div_s)(this.low, this.high, e.low, e.high), n.get_high(), this.unsigned)
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
              : ((r = this.sub(e.mul(t))), (s = t.add(r.div(e))));
          if (e.eq(E)) return this.unsigned ? v : w;
          if (this.isNegative()) return e.isNegative() ? this.neg().div(e.neg()) : this.neg().div(e).neg();
          if (e.isNegative()) return this.div(e.neg()).neg();
          s = w;
        }
        for (r = this; r.gte(e); ) {
          t = Math.max(1, Math.floor(r.toNumber() / e.toNumber()));
          for (
            var o = Math.ceil(Math.log(t) / Math.LN2), u = o <= 48 ? 1 : h(2, o - 48), d = a(t), g = d.mul(e);
            g.isNegative() || g.gt(r);

          )
            g = (d = a((t -= u), this.unsigned)).mul(e);
          d.isZero() && (d = m), (s = s.add(d)), (r = r.sub(g));
        }
        return s;
      }),
      (S.div = S.divide),
      (S.modulo = function (e) {
        return (
          i(e) || (e = l(e)),
          n
            ? c((this.unsigned ? n.rem_u : n.rem_s)(this.low, this.high, e.low, e.high), n.get_high(), this.unsigned)
            : this.sub(this.div(e).mul(e))
        );
      }),
      (S.mod = S.modulo),
      (S.rem = S.modulo),
      (S.not = function () {
        return c(~this.low, ~this.high, this.unsigned);
      }),
      (S.and = function (e) {
        return i(e) || (e = l(e)), c(this.low & e.low, this.high & e.high, this.unsigned);
      }),
      (S.or = function (e) {
        return i(e) || (e = l(e)), c(this.low | e.low, this.high | e.high, this.unsigned);
      }),
      (S.xor = function (e) {
        return i(e) || (e = l(e)), c(this.low ^ e.low, this.high ^ e.high, this.unsigned);
      }),
      (S.shiftLeft = function (e) {
        return (
          i(e) && (e = e.toInt()),
          0 == (e &= 63)
            ? this
            : e < 32
            ? c(this.low << e, (this.high << e) | (this.low >>> (32 - e)), this.unsigned)
            : c(0, this.low << (e - 32), this.unsigned)
        );
      }),
      (S.shl = S.shiftLeft),
      (S.shiftRight = function (e) {
        return (
          i(e) && (e = e.toInt()),
          0 == (e &= 63)
            ? this
            : e < 32
            ? c((this.low >>> e) | (this.high << (32 - e)), this.high >> e, this.unsigned)
            : c(this.high >> (e - 32), this.high >= 0 ? 0 : -1, this.unsigned)
        );
      }),
      (S.shr = S.shiftRight),
      (S.shiftRightUnsigned = function (e) {
        if ((i(e) && (e = e.toInt()), 0 === (e &= 63))) return this;
        var t = this.high;
        return e < 32
          ? c((this.low >>> e) | (t << (32 - e)), t >>> e, this.unsigned)
          : c(32 === e ? t : t >>> (e - 32), 0, this.unsigned);
      }),
      (S.shru = S.shiftRightUnsigned),
      (S.shr_u = S.shiftRightUnsigned),
      (S.toSigned = function () {
        return this.unsigned ? c(this.low, this.high, !1) : this;
      }),
      (S.toUnsigned = function () {
        return this.unsigned ? this : c(this.low, this.high, !0);
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
      (r.fromBytes = function (e, t, n) {
        return n ? r.fromBytesLE(e, t) : r.fromBytesBE(e, t);
      }),
      (r.fromBytesLE = function (e, t) {
        return new r(
          e[0] | (e[1] << 8) | (e[2] << 16) | (e[3] << 24),
          e[4] | (e[5] << 8) | (e[6] << 16) | (e[7] << 24),
          t,
        );
      }),
      (r.fromBytesBE = function (e, t) {
        return new r(
          (e[4] << 24) | (e[5] << 16) | (e[6] << 8) | e[7],
          (e[0] << 24) | (e[1] << 16) | (e[2] << 8) | e[3],
          t,
        );
      });
  },
});
