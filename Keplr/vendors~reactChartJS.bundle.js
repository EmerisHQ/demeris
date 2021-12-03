(window.webpackJsonp = window.webpackJsonp || []).push([
  [5],
  {
    1781: function (e, t, n) {
      (function (e) {
        e.exports = (function () {
          'use strict';
          var t, a;
          function r() {
            return t.apply(null, arguments);
          }
          function i(e) {
            return e instanceof Array || '[object Array]' === Object.prototype.toString.call(e);
          }
          function s(e) {
            return null != e && '[object Object]' === Object.prototype.toString.call(e);
          }
          function o(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
          }
          function d(e) {
            if (Object.getOwnPropertyNames) return 0 === Object.getOwnPropertyNames(e).length;
            var t;
            for (t in e) if (o(e, t)) return !1;
            return !0;
          }
          function l(e) {
            return void 0 === e;
          }
          function u(e) {
            return 'number' == typeof e || '[object Number]' === Object.prototype.toString.call(e);
          }
          function _(e) {
            return e instanceof Date || '[object Date]' === Object.prototype.toString.call(e);
          }
          function c(e, t) {
            var n,
              a = [];
            for (n = 0; n < e.length; ++n) a.push(t(e[n], n));
            return a;
          }
          function h(e, t) {
            for (var n in t) o(t, n) && (e[n] = t[n]);
            return o(t, 'toString') && (e.toString = t.toString), o(t, 'valueOf') && (e.valueOf = t.valueOf), e;
          }
          function m(e, t, n, a) {
            return Dt(e, t, n, a, !0).utc();
          }
          function f(e) {
            return (
              null == e._pf &&
                (e._pf = {
                  empty: !1,
                  unusedTokens: [],
                  unusedInput: [],
                  overflow: -2,
                  charsLeftOver: 0,
                  nullInput: !1,
                  invalidEra: null,
                  invalidMonth: null,
                  invalidFormat: !1,
                  userInvalidated: !1,
                  iso: !1,
                  parsedDateParts: [],
                  era: null,
                  meridiem: null,
                  rfc2822: !1,
                  weekdayMismatch: !1,
                }),
              e._pf
            );
          }
          function p(e) {
            if (null == e._isValid) {
              var t = f(e),
                n = a.call(t.parsedDateParts, function (e) {
                  return null != e;
                }),
                r =
                  !isNaN(e._d.getTime()) &&
                  t.overflow < 0 &&
                  !t.empty &&
                  !t.invalidEra &&
                  !t.invalidMonth &&
                  !t.invalidWeekday &&
                  !t.weekdayMismatch &&
                  !t.nullInput &&
                  !t.invalidFormat &&
                  !t.userInvalidated &&
                  (!t.meridiem || (t.meridiem && n));
              if (
                (e._strict && (r = r && 0 === t.charsLeftOver && 0 === t.unusedTokens.length && void 0 === t.bigHour),
                null != Object.isFrozen && Object.isFrozen(e))
              )
                return r;
              e._isValid = r;
            }
            return e._isValid;
          }
          function M(e) {
            var t = m(NaN);
            return null != e ? h(f(t), e) : (f(t).userInvalidated = !0), t;
          }
          a = Array.prototype.some
            ? Array.prototype.some
            : function (e) {
                var t,
                  n = Object(this),
                  a = n.length >>> 0;
                for (t = 0; t < a; t++) if (t in n && e.call(this, n[t], t, n)) return !0;
                return !1;
              };
          var y = (r.momentProperties = []),
            g = !1;
          function L(e, t) {
            var n, a, r;
            if (
              (l(t._isAMomentObject) || (e._isAMomentObject = t._isAMomentObject),
              l(t._i) || (e._i = t._i),
              l(t._f) || (e._f = t._f),
              l(t._l) || (e._l = t._l),
              l(t._strict) || (e._strict = t._strict),
              l(t._tzm) || (e._tzm = t._tzm),
              l(t._isUTC) || (e._isUTC = t._isUTC),
              l(t._offset) || (e._offset = t._offset),
              l(t._pf) || (e._pf = f(t)),
              l(t._locale) || (e._locale = t._locale),
              y.length > 0)
            )
              for (n = 0; n < y.length; n++) l((r = t[(a = y[n])])) || (e[a] = r);
            return e;
          }
          function v(e) {
            L(this, e),
              (this._d = new Date(null != e._d ? e._d.getTime() : NaN)),
              this.isValid() || (this._d = new Date(NaN)),
              !1 === g && ((g = !0), r.updateOffset(this), (g = !1));
          }
          function Y(e) {
            return e instanceof v || (null != e && null != e._isAMomentObject);
          }
          function b(e) {
            !1 === r.suppressDeprecationWarnings &&
              'undefined' != typeof console &&
              console.warn &&
              console.warn('Deprecation warning: ' + e);
          }
          function k(e, t) {
            var n = !0;
            return h(function () {
              if ((null != r.deprecationHandler && r.deprecationHandler(null, e), n)) {
                var a,
                  i,
                  s,
                  d = [];
                for (i = 0; i < arguments.length; i++) {
                  if (((a = ''), 'object' == typeof arguments[i])) {
                    for (s in ((a += '\n[' + i + '] '), arguments[0]))
                      o(arguments[0], s) && (a += s + ': ' + arguments[0][s] + ', ');
                    a = a.slice(0, -2);
                  } else a = arguments[i];
                  d.push(a);
                }
                b(e + '\nArguments: ' + Array.prototype.slice.call(d).join('') + '\n' + new Error().stack), (n = !1);
              }
              return t.apply(this, arguments);
            }, t);
          }
          var D,
            w = {};
          function x(e, t) {
            null != r.deprecationHandler && r.deprecationHandler(e, t), w[e] || (b(t), (w[e] = !0));
          }
          function T(e) {
            return (
              ('undefined' != typeof Function && e instanceof Function) ||
              '[object Function]' === Object.prototype.toString.call(e)
            );
          }
          function S(e, t) {
            var n,
              a = h({}, e);
            for (n in t)
              o(t, n) &&
                (s(e[n]) && s(t[n])
                  ? ((a[n] = {}), h(a[n], e[n]), h(a[n], t[n]))
                  : null != t[n]
                  ? (a[n] = t[n])
                  : delete a[n]);
            for (n in e) o(e, n) && !o(t, n) && s(e[n]) && (a[n] = h({}, a[n]));
            return a;
          }
          function H(e) {
            null != e && this.set(e);
          }
          function j(e, t, n) {
            var a = '' + Math.abs(e),
              r = t - a.length;
            return (e >= 0 ? (n ? '+' : '') : '-') + Math.pow(10, Math.max(0, r)).toString().substr(1) + a;
          }
          (r.suppressDeprecationWarnings = !1),
            (r.deprecationHandler = null),
            (D = Object.keys
              ? Object.keys
              : function (e) {
                  var t,
                    n = [];
                  for (t in e) o(e, t) && n.push(t);
                  return n;
                });
          var P =
              /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
            O = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
            A = {},
            F = {};
          function W(e, t, n, a) {
            var r = a;
            'string' == typeof a &&
              (r = function () {
                return this[a]();
              }),
              e && (F[e] = r),
              t &&
                (F[t[0]] = function () {
                  return j(r.apply(this, arguments), t[1], t[2]);
                }),
              n &&
                (F[n] = function () {
                  return this.localeData().ordinal(r.apply(this, arguments), e);
                });
          }
          function C(e, t) {
            return e.isValid()
              ? ((t = E(t, e.localeData())),
                (A[t] =
                  A[t] ||
                  (function (e) {
                    var t,
                      n,
                      a,
                      r = e.match(P);
                    for (t = 0, n = r.length; t < n; t++)
                      F[r[t]]
                        ? (r[t] = F[r[t]])
                        : (r[t] = (a = r[t]).match(/\[[\s\S]/) ? a.replace(/^\[|\]$/g, '') : a.replace(/\\/g, ''));
                    return function (t) {
                      var a,
                        i = '';
                      for (a = 0; a < n; a++) i += T(r[a]) ? r[a].call(t, e) : r[a];
                      return i;
                    };
                  })(t)),
                A[t](e))
              : e.localeData().invalidDate();
          }
          function E(e, t) {
            var n = 5;
            function a(e) {
              return t.longDateFormat(e) || e;
            }
            for (O.lastIndex = 0; n >= 0 && O.test(e); ) (e = e.replace(O, a)), (O.lastIndex = 0), (n -= 1);
            return e;
          }
          var z = {};
          function I(e, t) {
            var n = e.toLowerCase();
            z[n] = z[n + 's'] = z[t] = e;
          }
          function N(e) {
            return 'string' == typeof e ? z[e] || z[e.toLowerCase()] : void 0;
          }
          function R(e) {
            var t,
              n,
              a = {};
            for (n in e) o(e, n) && (t = N(n)) && (a[t] = e[n]);
            return a;
          }
          var V = {};
          function B(e, t) {
            V[e] = t;
          }
          function J(e) {
            return (e % 4 == 0 && e % 100 != 0) || e % 400 == 0;
          }
          function U(e) {
            return e < 0 ? Math.ceil(e) || 0 : Math.floor(e);
          }
          function G(e) {
            var t = +e,
              n = 0;
            return 0 !== t && isFinite(t) && (n = U(t)), n;
          }
          function q(e, t) {
            return function (n) {
              return null != n ? (K(this, e, n), r.updateOffset(this, t), this) : $(this, e);
            };
          }
          function $(e, t) {
            return e.isValid() ? e._d['get' + (e._isUTC ? 'UTC' : '') + t]() : NaN;
          }
          function K(e, t, n) {
            e.isValid() &&
              !isNaN(n) &&
              ('FullYear' === t && J(e.year()) && 1 === e.month() && 29 === e.date()
                ? ((n = G(n)), e._d['set' + (e._isUTC ? 'UTC' : '') + t](n, e.month(), Ye(n, e.month())))
                : e._d['set' + (e._isUTC ? 'UTC' : '') + t](n));
          }
          var Z,
            X = /\d/,
            Q = /\d\d/,
            ee = /\d{3}/,
            te = /\d{4}/,
            ne = /[+-]?\d{6}/,
            ae = /\d\d?/,
            re = /\d\d\d\d?/,
            ie = /\d\d\d\d\d\d?/,
            se = /\d{1,3}/,
            oe = /\d{1,4}/,
            de = /[+-]?\d{1,6}/,
            le = /\d+/,
            ue = /[+-]?\d+/,
            _e = /Z|[+-]\d\d:?\d\d/gi,
            ce = /Z|[+-]\d\d(?::?\d\d)?/gi,
            he =
              /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;
          function me(e, t, n) {
            Z[e] = T(t)
              ? t
              : function (e, a) {
                  return e && n ? n : t;
                };
          }
          function fe(e, t) {
            return o(Z, e)
              ? Z[e](t._strict, t._locale)
              : new RegExp(
                  pe(
                    e.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (e, t, n, a, r) {
                      return t || n || a || r;
                    }),
                  ),
                );
          }
          function pe(e) {
            return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          }
          Z = {};
          var Me,
            ye = {};
          function ge(e, t) {
            var n,
              a = t;
            for (
              'string' == typeof e && (e = [e]),
                u(t) &&
                  (a = function (e, n) {
                    n[t] = G(e);
                  }),
                n = 0;
              n < e.length;
              n++
            )
              ye[e[n]] = a;
          }
          function Le(e, t) {
            ge(e, function (e, n, a, r) {
              (a._w = a._w || {}), t(e, a._w, a, r);
            });
          }
          function ve(e, t, n) {
            null != t && o(ye, e) && ye[e](t, n._a, n, e);
          }
          function Ye(e, t) {
            if (isNaN(e) || isNaN(t)) return NaN;
            var n,
              a = ((t % (n = 12)) + n) % n;
            return (e += (t - a) / 12), 1 === a ? (J(e) ? 29 : 28) : 31 - ((a % 7) % 2);
          }
          (Me = Array.prototype.indexOf
            ? Array.prototype.indexOf
            : function (e) {
                var t;
                for (t = 0; t < this.length; ++t) if (this[t] === e) return t;
                return -1;
              }),
            W('M', ['MM', 2], 'Mo', function () {
              return this.month() + 1;
            }),
            W('MMM', 0, 0, function (e) {
              return this.localeData().monthsShort(this, e);
            }),
            W('MMMM', 0, 0, function (e) {
              return this.localeData().months(this, e);
            }),
            I('month', 'M'),
            B('month', 8),
            me('M', ae),
            me('MM', ae, Q),
            me('MMM', function (e, t) {
              return t.monthsShortRegex(e);
            }),
            me('MMMM', function (e, t) {
              return t.monthsRegex(e);
            }),
            ge(['M', 'MM'], function (e, t) {
              t[1] = G(e) - 1;
            }),
            ge(['MMM', 'MMMM'], function (e, t, n, a) {
              var r = n._locale.monthsParse(e, a, n._strict);
              null != r ? (t[1] = r) : (f(n).invalidMonth = e);
            });
          var be = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
            ke = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
            De = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
            we = he,
            xe = he;
          function Te(e, t, n) {
            var a,
              r,
              i,
              s = e.toLocaleLowerCase();
            if (!this._monthsParse)
              for (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = [], a = 0; a < 12; ++a)
                (i = m([2e3, a])),
                  (this._shortMonthsParse[a] = this.monthsShort(i, '').toLocaleLowerCase()),
                  (this._longMonthsParse[a] = this.months(i, '').toLocaleLowerCase());
            return n
              ? 'MMM' === t
                ? -1 !== (r = Me.call(this._shortMonthsParse, s))
                  ? r
                  : null
                : -1 !== (r = Me.call(this._longMonthsParse, s))
                ? r
                : null
              : 'MMM' === t
              ? -1 !== (r = Me.call(this._shortMonthsParse, s)) || -1 !== (r = Me.call(this._longMonthsParse, s))
                ? r
                : null
              : -1 !== (r = Me.call(this._longMonthsParse, s)) || -1 !== (r = Me.call(this._shortMonthsParse, s))
              ? r
              : null;
          }
          function Se(e, t) {
            var n;
            if (!e.isValid()) return e;
            if ('string' == typeof t)
              if (/^\d+$/.test(t)) t = G(t);
              else if (!u((t = e.localeData().monthsParse(t)))) return e;
            return (n = Math.min(e.date(), Ye(e.year(), t))), e._d['set' + (e._isUTC ? 'UTC' : '') + 'Month'](t, n), e;
          }
          function He(e) {
            return null != e ? (Se(this, e), r.updateOffset(this, !0), this) : $(this, 'Month');
          }
          function je() {
            function e(e, t) {
              return t.length - e.length;
            }
            var t,
              n,
              a = [],
              r = [],
              i = [];
            for (t = 0; t < 12; t++)
              (n = m([2e3, t])),
                a.push(this.monthsShort(n, '')),
                r.push(this.months(n, '')),
                i.push(this.months(n, '')),
                i.push(this.monthsShort(n, ''));
            for (a.sort(e), r.sort(e), i.sort(e), t = 0; t < 12; t++) (a[t] = pe(a[t])), (r[t] = pe(r[t]));
            for (t = 0; t < 24; t++) i[t] = pe(i[t]);
            (this._monthsRegex = new RegExp('^(' + i.join('|') + ')', 'i')),
              (this._monthsShortRegex = this._monthsRegex),
              (this._monthsStrictRegex = new RegExp('^(' + r.join('|') + ')', 'i')),
              (this._monthsShortStrictRegex = new RegExp('^(' + a.join('|') + ')', 'i'));
          }
          function Pe(e) {
            return J(e) ? 366 : 365;
          }
          W('Y', 0, 0, function () {
            var e = this.year();
            return e <= 9999 ? j(e, 4) : '+' + e;
          }),
            W(0, ['YY', 2], 0, function () {
              return this.year() % 100;
            }),
            W(0, ['YYYY', 4], 0, 'year'),
            W(0, ['YYYYY', 5], 0, 'year'),
            W(0, ['YYYYYY', 6, !0], 0, 'year'),
            I('year', 'y'),
            B('year', 1),
            me('Y', ue),
            me('YY', ae, Q),
            me('YYYY', oe, te),
            me('YYYYY', de, ne),
            me('YYYYYY', de, ne),
            ge(['YYYYY', 'YYYYYY'], 0),
            ge('YYYY', function (e, t) {
              t[0] = 2 === e.length ? r.parseTwoDigitYear(e) : G(e);
            }),
            ge('YY', function (e, t) {
              t[0] = r.parseTwoDigitYear(e);
            }),
            ge('Y', function (e, t) {
              t[0] = parseInt(e, 10);
            }),
            (r.parseTwoDigitYear = function (e) {
              return G(e) + (G(e) > 68 ? 1900 : 2e3);
            });
          var Oe = q('FullYear', !0);
          function Ae(e, t, n, a, r, i, s) {
            var o;
            return (
              e < 100 && e >= 0
                ? ((o = new Date(e + 400, t, n, a, r, i, s)), isFinite(o.getFullYear()) && o.setFullYear(e))
                : (o = new Date(e, t, n, a, r, i, s)),
              o
            );
          }
          function Fe(e) {
            var t, n;
            return (
              e < 100 && e >= 0
                ? (((n = Array.prototype.slice.call(arguments))[0] = e + 400),
                  (t = new Date(Date.UTC.apply(null, n))),
                  isFinite(t.getUTCFullYear()) && t.setUTCFullYear(e))
                : (t = new Date(Date.UTC.apply(null, arguments))),
              t
            );
          }
          function We(e, t, n) {
            var a = 7 + t - n;
            return (-(7 + Fe(e, 0, a).getUTCDay() - t) % 7) + a - 1;
          }
          function Ce(e, t, n, a, r) {
            var i,
              s,
              o = 1 + 7 * (t - 1) + ((7 + n - a) % 7) + We(e, a, r);
            return (
              o <= 0 ? (s = Pe((i = e - 1)) + o) : o > Pe(e) ? ((i = e + 1), (s = o - Pe(e))) : ((i = e), (s = o)),
              { year: i, dayOfYear: s }
            );
          }
          function Ee(e, t, n) {
            var a,
              r,
              i = We(e.year(), t, n),
              s = Math.floor((e.dayOfYear() - i - 1) / 7) + 1;
            return (
              s < 1
                ? (a = s + ze((r = e.year() - 1), t, n))
                : s > ze(e.year(), t, n)
                ? ((a = s - ze(e.year(), t, n)), (r = e.year() + 1))
                : ((r = e.year()), (a = s)),
              { week: a, year: r }
            );
          }
          function ze(e, t, n) {
            var a = We(e, t, n),
              r = We(e + 1, t, n);
            return (Pe(e) - a + r) / 7;
          }
          function Ie(e, t) {
            return e.slice(t, 7).concat(e.slice(0, t));
          }
          W('w', ['ww', 2], 'wo', 'week'),
            W('W', ['WW', 2], 'Wo', 'isoWeek'),
            I('week', 'w'),
            I('isoWeek', 'W'),
            B('week', 5),
            B('isoWeek', 5),
            me('w', ae),
            me('ww', ae, Q),
            me('W', ae),
            me('WW', ae, Q),
            Le(['w', 'ww', 'W', 'WW'], function (e, t, n, a) {
              t[a.substr(0, 1)] = G(e);
            }),
            W('d', 0, 'do', 'day'),
            W('dd', 0, 0, function (e) {
              return this.localeData().weekdaysMin(this, e);
            }),
            W('ddd', 0, 0, function (e) {
              return this.localeData().weekdaysShort(this, e);
            }),
            W('dddd', 0, 0, function (e) {
              return this.localeData().weekdays(this, e);
            }),
            W('e', 0, 0, 'weekday'),
            W('E', 0, 0, 'isoWeekday'),
            I('day', 'd'),
            I('weekday', 'e'),
            I('isoWeekday', 'E'),
            B('day', 11),
            B('weekday', 11),
            B('isoWeekday', 11),
            me('d', ae),
            me('e', ae),
            me('E', ae),
            me('dd', function (e, t) {
              return t.weekdaysMinRegex(e);
            }),
            me('ddd', function (e, t) {
              return t.weekdaysShortRegex(e);
            }),
            me('dddd', function (e, t) {
              return t.weekdaysRegex(e);
            }),
            Le(['dd', 'ddd', 'dddd'], function (e, t, n, a) {
              var r = n._locale.weekdaysParse(e, a, n._strict);
              null != r ? (t.d = r) : (f(n).invalidWeekday = e);
            }),
            Le(['d', 'e', 'E'], function (e, t, n, a) {
              t[a] = G(e);
            });
          var Ne = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
            Re = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            Ve = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
            Be = he,
            Je = he,
            Ue = he;
          function Ge(e, t, n) {
            var a,
              r,
              i,
              s = e.toLocaleLowerCase();
            if (!this._weekdaysParse)
              for (
                this._weekdaysParse = [], this._shortWeekdaysParse = [], this._minWeekdaysParse = [], a = 0;
                a < 7;
                ++a
              )
                (i = m([2e3, 1]).day(a)),
                  (this._minWeekdaysParse[a] = this.weekdaysMin(i, '').toLocaleLowerCase()),
                  (this._shortWeekdaysParse[a] = this.weekdaysShort(i, '').toLocaleLowerCase()),
                  (this._weekdaysParse[a] = this.weekdays(i, '').toLocaleLowerCase());
            return n
              ? 'dddd' === t
                ? -1 !== (r = Me.call(this._weekdaysParse, s))
                  ? r
                  : null
                : 'ddd' === t
                ? -1 !== (r = Me.call(this._shortWeekdaysParse, s))
                  ? r
                  : null
                : -1 !== (r = Me.call(this._minWeekdaysParse, s))
                ? r
                : null
              : 'dddd' === t
              ? -1 !== (r = Me.call(this._weekdaysParse, s)) ||
                -1 !== (r = Me.call(this._shortWeekdaysParse, s)) ||
                -1 !== (r = Me.call(this._minWeekdaysParse, s))
                ? r
                : null
              : 'ddd' === t
              ? -1 !== (r = Me.call(this._shortWeekdaysParse, s)) ||
                -1 !== (r = Me.call(this._weekdaysParse, s)) ||
                -1 !== (r = Me.call(this._minWeekdaysParse, s))
                ? r
                : null
              : -1 !== (r = Me.call(this._minWeekdaysParse, s)) ||
                -1 !== (r = Me.call(this._weekdaysParse, s)) ||
                -1 !== (r = Me.call(this._shortWeekdaysParse, s))
              ? r
              : null;
          }
          function qe() {
            function e(e, t) {
              return t.length - e.length;
            }
            var t,
              n,
              a,
              r,
              i,
              s = [],
              o = [],
              d = [],
              l = [];
            for (t = 0; t < 7; t++)
              (n = m([2e3, 1]).day(t)),
                (a = pe(this.weekdaysMin(n, ''))),
                (r = pe(this.weekdaysShort(n, ''))),
                (i = pe(this.weekdays(n, ''))),
                s.push(a),
                o.push(r),
                d.push(i),
                l.push(a),
                l.push(r),
                l.push(i);
            s.sort(e),
              o.sort(e),
              d.sort(e),
              l.sort(e),
              (this._weekdaysRegex = new RegExp('^(' + l.join('|') + ')', 'i')),
              (this._weekdaysShortRegex = this._weekdaysRegex),
              (this._weekdaysMinRegex = this._weekdaysRegex),
              (this._weekdaysStrictRegex = new RegExp('^(' + d.join('|') + ')', 'i')),
              (this._weekdaysShortStrictRegex = new RegExp('^(' + o.join('|') + ')', 'i')),
              (this._weekdaysMinStrictRegex = new RegExp('^(' + s.join('|') + ')', 'i'));
          }
          function $e() {
            return this.hours() % 12 || 12;
          }
          function Ke(e, t) {
            W(e, 0, 0, function () {
              return this.localeData().meridiem(this.hours(), this.minutes(), t);
            });
          }
          function Ze(e, t) {
            return t._meridiemParse;
          }
          W('H', ['HH', 2], 0, 'hour'),
            W('h', ['hh', 2], 0, $e),
            W('k', ['kk', 2], 0, function () {
              return this.hours() || 24;
            }),
            W('hmm', 0, 0, function () {
              return '' + $e.apply(this) + j(this.minutes(), 2);
            }),
            W('hmmss', 0, 0, function () {
              return '' + $e.apply(this) + j(this.minutes(), 2) + j(this.seconds(), 2);
            }),
            W('Hmm', 0, 0, function () {
              return '' + this.hours() + j(this.minutes(), 2);
            }),
            W('Hmmss', 0, 0, function () {
              return '' + this.hours() + j(this.minutes(), 2) + j(this.seconds(), 2);
            }),
            Ke('a', !0),
            Ke('A', !1),
            I('hour', 'h'),
            B('hour', 13),
            me('a', Ze),
            me('A', Ze),
            me('H', ae),
            me('h', ae),
            me('k', ae),
            me('HH', ae, Q),
            me('hh', ae, Q),
            me('kk', ae, Q),
            me('hmm', re),
            me('hmmss', ie),
            me('Hmm', re),
            me('Hmmss', ie),
            ge(['H', 'HH'], 3),
            ge(['k', 'kk'], function (e, t, n) {
              var a = G(e);
              t[3] = 24 === a ? 0 : a;
            }),
            ge(['a', 'A'], function (e, t, n) {
              (n._isPm = n._locale.isPM(e)), (n._meridiem = e);
            }),
            ge(['h', 'hh'], function (e, t, n) {
              (t[3] = G(e)), (f(n).bigHour = !0);
            }),
            ge('hmm', function (e, t, n) {
              var a = e.length - 2;
              (t[3] = G(e.substr(0, a))), (t[4] = G(e.substr(a))), (f(n).bigHour = !0);
            }),
            ge('hmmss', function (e, t, n) {
              var a = e.length - 4,
                r = e.length - 2;
              (t[3] = G(e.substr(0, a))), (t[4] = G(e.substr(a, 2))), (t[5] = G(e.substr(r))), (f(n).bigHour = !0);
            }),
            ge('Hmm', function (e, t, n) {
              var a = e.length - 2;
              (t[3] = G(e.substr(0, a))), (t[4] = G(e.substr(a)));
            }),
            ge('Hmmss', function (e, t, n) {
              var a = e.length - 4,
                r = e.length - 2;
              (t[3] = G(e.substr(0, a))), (t[4] = G(e.substr(a, 2))), (t[5] = G(e.substr(r)));
            });
          var Xe,
            Qe = q('Hours', !0),
            et = {
              calendar: {
                sameDay: '[Today at] LT',
                nextDay: '[Tomorrow at] LT',
                nextWeek: 'dddd [at] LT',
                lastDay: '[Yesterday at] LT',
                lastWeek: '[Last] dddd [at] LT',
                sameElse: 'L',
              },
              longDateFormat: {
                LTS: 'h:mm:ss A',
                LT: 'h:mm A',
                L: 'MM/DD/YYYY',
                LL: 'MMMM D, YYYY',
                LLL: 'MMMM D, YYYY h:mm A',
                LLLL: 'dddd, MMMM D, YYYY h:mm A',
              },
              invalidDate: 'Invalid date',
              ordinal: '%d',
              dayOfMonthOrdinalParse: /\d{1,2}/,
              relativeTime: {
                future: 'in %s',
                past: '%s ago',
                s: 'a few seconds',
                ss: '%d seconds',
                m: 'a minute',
                mm: '%d minutes',
                h: 'an hour',
                hh: '%d hours',
                d: 'a day',
                dd: '%d days',
                w: 'a week',
                ww: '%d weeks',
                M: 'a month',
                MM: '%d months',
                y: 'a year',
                yy: '%d years',
              },
              months: be,
              monthsShort: ke,
              week: { dow: 0, doy: 6 },
              weekdays: Ne,
              weekdaysMin: Ve,
              weekdaysShort: Re,
              meridiemParse: /[ap]\.?m?\.?/i,
            },
            tt = {},
            nt = {};
          function at(e, t) {
            var n,
              a = Math.min(e.length, t.length);
            for (n = 0; n < a; n += 1) if (e[n] !== t[n]) return n;
            return a;
          }
          function rt(e) {
            return e ? e.toLowerCase().replace('_', '-') : e;
          }
          function it(t) {
            var a = null;
            if (void 0 === tt[t] && void 0 !== e && e && e.exports)
              try {
                (a = Xe._abbr), n(1952)('./' + t), st(a);
              } catch (e) {
                tt[t] = null;
              }
            return tt[t];
          }
          function st(e, t) {
            var n;
            return (
              e &&
                ((n = l(t) ? dt(e) : ot(e, t))
                  ? (Xe = n)
                  : 'undefined' != typeof console &&
                    console.warn &&
                    console.warn('Locale ' + e + ' not found. Did you forget to load it?')),
              Xe._abbr
            );
          }
          function ot(e, t) {
            if (null !== t) {
              var n,
                a = et;
              if (((t.abbr = e), null != tt[e]))
                x(
                  'defineLocaleOverride',
                  'use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info.',
                ),
                  (a = tt[e]._config);
              else if (null != t.parentLocale)
                if (null != tt[t.parentLocale]) a = tt[t.parentLocale]._config;
                else {
                  if (null == (n = it(t.parentLocale)))
                    return (
                      nt[t.parentLocale] || (nt[t.parentLocale] = []),
                      nt[t.parentLocale].push({ name: e, config: t }),
                      null
                    );
                  a = n._config;
                }
              return (
                (tt[e] = new H(S(a, t))),
                nt[e] &&
                  nt[e].forEach(function (e) {
                    ot(e.name, e.config);
                  }),
                st(e),
                tt[e]
              );
            }
            return delete tt[e], null;
          }
          function dt(e) {
            var t;
            if ((e && e._locale && e._locale._abbr && (e = e._locale._abbr), !e)) return Xe;
            if (!i(e)) {
              if ((t = it(e))) return t;
              e = [e];
            }
            return (function (e) {
              for (var t, n, a, r, i = 0; i < e.length; ) {
                for (t = (r = rt(e[i]).split('-')).length, n = (n = rt(e[i + 1])) ? n.split('-') : null; t > 0; ) {
                  if ((a = it(r.slice(0, t).join('-')))) return a;
                  if (n && n.length >= t && at(r, n) >= t - 1) break;
                  t--;
                }
                i++;
              }
              return Xe;
            })(e);
          }
          function lt(e) {
            var t,
              n = e._a;
            return (
              n &&
                -2 === f(e).overflow &&
                ((t =
                  n[1] < 0 || n[1] > 11
                    ? 1
                    : n[2] < 1 || n[2] > Ye(n[0], n[1])
                    ? 2
                    : n[3] < 0 || n[3] > 24 || (24 === n[3] && (0 !== n[4] || 0 !== n[5] || 0 !== n[6]))
                    ? 3
                    : n[4] < 0 || n[4] > 59
                    ? 4
                    : n[5] < 0 || n[5] > 59
                    ? 5
                    : n[6] < 0 || n[6] > 999
                    ? 6
                    : -1),
                f(e)._overflowDayOfYear && (t < 0 || t > 2) && (t = 2),
                f(e)._overflowWeeks && -1 === t && (t = 7),
                f(e)._overflowWeekday && -1 === t && (t = 8),
                (f(e).overflow = t)),
              e
            );
          }
          var ut =
              /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
            _t =
              /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
            ct = /Z|[+-]\d\d(?::?\d\d)?/,
            ht = [
              ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
              ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
              ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
              ['GGGG-[W]WW', /\d{4}-W\d\d/, !1],
              ['YYYY-DDD', /\d{4}-\d{3}/],
              ['YYYY-MM', /\d{4}-\d\d/, !1],
              ['YYYYYYMMDD', /[+-]\d{10}/],
              ['YYYYMMDD', /\d{8}/],
              ['GGGG[W]WWE', /\d{4}W\d{3}/],
              ['GGGG[W]WW', /\d{4}W\d{2}/, !1],
              ['YYYYDDD', /\d{7}/],
              ['YYYYMM', /\d{6}/, !1],
              ['YYYY', /\d{4}/, !1],
            ],
            mt = [
              ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
              ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
              ['HH:mm:ss', /\d\d:\d\d:\d\d/],
              ['HH:mm', /\d\d:\d\d/],
              ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
              ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
              ['HHmmss', /\d\d\d\d\d\d/],
              ['HHmm', /\d\d\d\d/],
              ['HH', /\d\d/],
            ],
            ft = /^\/?Date\((-?\d+)/i,
            pt =
              /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
            Mt = {
              UT: 0,
              GMT: 0,
              EDT: -240,
              EST: -300,
              CDT: -300,
              CST: -360,
              MDT: -360,
              MST: -420,
              PDT: -420,
              PST: -480,
            };
          function yt(e) {
            var t,
              n,
              a,
              r,
              i,
              s,
              o = e._i,
              d = ut.exec(o) || _t.exec(o);
            if (d) {
              for (f(e).iso = !0, t = 0, n = ht.length; t < n; t++)
                if (ht[t][1].exec(d[1])) {
                  (r = ht[t][0]), (a = !1 !== ht[t][2]);
                  break;
                }
              if (null == r) return void (e._isValid = !1);
              if (d[3]) {
                for (t = 0, n = mt.length; t < n; t++)
                  if (mt[t][1].exec(d[3])) {
                    i = (d[2] || ' ') + mt[t][0];
                    break;
                  }
                if (null == i) return void (e._isValid = !1);
              }
              if (!a && null != i) return void (e._isValid = !1);
              if (d[4]) {
                if (!ct.exec(d[4])) return void (e._isValid = !1);
                s = 'Z';
              }
              (e._f = r + (i || '') + (s || '')), bt(e);
            } else e._isValid = !1;
          }
          function gt(e) {
            var t = parseInt(e, 10);
            return t <= 49 ? 2e3 + t : t <= 999 ? 1900 + t : t;
          }
          function Lt(e) {
            var t,
              n,
              a,
              r,
              i,
              s,
              o,
              d,
              l = pt.exec(
                e._i
                  .replace(/\([^)]*\)|[\n\t]/g, ' ')
                  .replace(/(\s\s+)/g, ' ')
                  .replace(/^\s\s*/, '')
                  .replace(/\s\s*$/, ''),
              );
            if (l) {
              if (
                ((n = l[4]),
                (a = l[3]),
                (r = l[2]),
                (i = l[5]),
                (s = l[6]),
                (o = l[7]),
                (d = [gt(n), ke.indexOf(a), parseInt(r, 10), parseInt(i, 10), parseInt(s, 10)]),
                o && d.push(parseInt(o, 10)),
                (t = d),
                !(function (e, t, n) {
                  return (
                    !e ||
                    Re.indexOf(e) === new Date(t[0], t[1], t[2]).getDay() ||
                    ((f(n).weekdayMismatch = !0), (n._isValid = !1), !1)
                  );
                })(l[1], t, e))
              )
                return;
              (e._a = t),
                (e._tzm = (function (e, t, n) {
                  if (e) return Mt[e];
                  if (t) return 0;
                  var a = parseInt(n, 10),
                    r = a % 100;
                  return ((a - r) / 100) * 60 + r;
                })(l[8], l[9], l[10])),
                (e._d = Fe.apply(null, e._a)),
                e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm),
                (f(e).rfc2822 = !0);
            } else e._isValid = !1;
          }
          function vt(e, t, n) {
            return null != e ? e : null != t ? t : n;
          }
          function Yt(e) {
            var t,
              n,
              a,
              i,
              s,
              o = [];
            if (!e._d) {
              for (
                a = (function (e) {
                  var t = new Date(r.now());
                  return e._useUTC
                    ? [t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()]
                    : [t.getFullYear(), t.getMonth(), t.getDate()];
                })(e),
                  e._w &&
                    null == e._a[2] &&
                    null == e._a[1] &&
                    (function (e) {
                      var t, n, a, r, i, s, o, d, l;
                      null != (t = e._w).GG || null != t.W || null != t.E
                        ? ((i = 1),
                          (s = 4),
                          (n = vt(t.GG, e._a[0], Ee(wt(), 1, 4).year)),
                          (a = vt(t.W, 1)),
                          ((r = vt(t.E, 1)) < 1 || r > 7) && (d = !0))
                        : ((i = e._locale._week.dow),
                          (s = e._locale._week.doy),
                          (l = Ee(wt(), i, s)),
                          (n = vt(t.gg, e._a[0], l.year)),
                          (a = vt(t.w, l.week)),
                          null != t.d
                            ? ((r = t.d) < 0 || r > 6) && (d = !0)
                            : null != t.e
                            ? ((r = t.e + i), (t.e < 0 || t.e > 6) && (d = !0))
                            : (r = i)),
                        a < 1 || a > ze(n, i, s)
                          ? (f(e)._overflowWeeks = !0)
                          : null != d
                          ? (f(e)._overflowWeekday = !0)
                          : ((o = Ce(n, a, r, i, s)), (e._a[0] = o.year), (e._dayOfYear = o.dayOfYear));
                    })(e),
                  null != e._dayOfYear &&
                    ((s = vt(e._a[0], a[0])),
                    (e._dayOfYear > Pe(s) || 0 === e._dayOfYear) && (f(e)._overflowDayOfYear = !0),
                    (n = Fe(s, 0, e._dayOfYear)),
                    (e._a[1] = n.getUTCMonth()),
                    (e._a[2] = n.getUTCDate())),
                  t = 0;
                t < 3 && null == e._a[t];
                ++t
              )
                e._a[t] = o[t] = a[t];
              for (; t < 7; t++) e._a[t] = o[t] = null == e._a[t] ? (2 === t ? 1 : 0) : e._a[t];
              24 === e._a[3] && 0 === e._a[4] && 0 === e._a[5] && 0 === e._a[6] && ((e._nextDay = !0), (e._a[3] = 0)),
                (e._d = (e._useUTC ? Fe : Ae).apply(null, o)),
                (i = e._useUTC ? e._d.getUTCDay() : e._d.getDay()),
                null != e._tzm && e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm),
                e._nextDay && (e._a[3] = 24),
                e._w && void 0 !== e._w.d && e._w.d !== i && (f(e).weekdayMismatch = !0);
            }
          }
          function bt(e) {
            if (e._f !== r.ISO_8601)
              if (e._f !== r.RFC_2822) {
                (e._a = []), (f(e).empty = !0);
                var t,
                  n,
                  a,
                  i,
                  s,
                  o,
                  d = '' + e._i,
                  l = d.length,
                  u = 0;
                for (a = E(e._f, e._locale).match(P) || [], t = 0; t < a.length; t++)
                  (i = a[t]),
                    (n = (d.match(fe(i, e)) || [])[0]) &&
                      ((s = d.substr(0, d.indexOf(n))).length > 0 && f(e).unusedInput.push(s),
                      (d = d.slice(d.indexOf(n) + n.length)),
                      (u += n.length)),
                    F[i]
                      ? (n ? (f(e).empty = !1) : f(e).unusedTokens.push(i), ve(i, n, e))
                      : e._strict && !n && f(e).unusedTokens.push(i);
                (f(e).charsLeftOver = l - u),
                  d.length > 0 && f(e).unusedInput.push(d),
                  e._a[3] <= 12 && !0 === f(e).bigHour && e._a[3] > 0 && (f(e).bigHour = void 0),
                  (f(e).parsedDateParts = e._a.slice(0)),
                  (f(e).meridiem = e._meridiem),
                  (e._a[3] = (function (e, t, n) {
                    var a;
                    return null == n
                      ? t
                      : null != e.meridiemHour
                      ? e.meridiemHour(t, n)
                      : null != e.isPM
                      ? ((a = e.isPM(n)) && t < 12 && (t += 12), a || 12 !== t || (t = 0), t)
                      : t;
                  })(e._locale, e._a[3], e._meridiem)),
                  null !== (o = f(e).era) && (e._a[0] = e._locale.erasConvertYear(o, e._a[0])),
                  Yt(e),
                  lt(e);
              } else Lt(e);
            else yt(e);
          }
          function kt(e) {
            var t = e._i,
              n = e._f;
            return (
              (e._locale = e._locale || dt(e._l)),
              null === t || (void 0 === n && '' === t)
                ? M({ nullInput: !0 })
                : ('string' == typeof t && (e._i = t = e._locale.preparse(t)),
                  Y(t)
                    ? new v(lt(t))
                    : (_(t)
                        ? (e._d = t)
                        : i(n)
                        ? (function (e) {
                            var t,
                              n,
                              a,
                              r,
                              i,
                              s,
                              o = !1;
                            if (0 === e._f.length) return (f(e).invalidFormat = !0), void (e._d = new Date(NaN));
                            for (r = 0; r < e._f.length; r++)
                              (i = 0),
                                (s = !1),
                                (t = L({}, e)),
                                null != e._useUTC && (t._useUTC = e._useUTC),
                                (t._f = e._f[r]),
                                bt(t),
                                p(t) && (s = !0),
                                (i += f(t).charsLeftOver),
                                (i += 10 * f(t).unusedTokens.length),
                                (f(t).score = i),
                                o
                                  ? i < a && ((a = i), (n = t))
                                  : (null == a || i < a || s) && ((a = i), (n = t), s && (o = !0));
                            h(e, n || t);
                          })(e)
                        : n
                        ? bt(e)
                        : (function (e) {
                            var t = e._i;
                            l(t)
                              ? (e._d = new Date(r.now()))
                              : _(t)
                              ? (e._d = new Date(t.valueOf()))
                              : 'string' == typeof t
                              ? (function (e) {
                                  var t = ft.exec(e._i);
                                  null === t
                                    ? (yt(e),
                                      !1 === e._isValid &&
                                        (delete e._isValid,
                                        Lt(e),
                                        !1 === e._isValid &&
                                          (delete e._isValid,
                                          e._strict ? (e._isValid = !1) : r.createFromInputFallback(e))))
                                    : (e._d = new Date(+t[1]));
                                })(e)
                              : i(t)
                              ? ((e._a = c(t.slice(0), function (e) {
                                  return parseInt(e, 10);
                                })),
                                Yt(e))
                              : s(t)
                              ? (function (e) {
                                  if (!e._d) {
                                    var t = R(e._i),
                                      n = void 0 === t.day ? t.date : t.day;
                                    (e._a = c(
                                      [t.year, t.month, n, t.hour, t.minute, t.second, t.millisecond],
                                      function (e) {
                                        return e && parseInt(e, 10);
                                      },
                                    )),
                                      Yt(e);
                                  }
                                })(e)
                              : u(t)
                              ? (e._d = new Date(t))
                              : r.createFromInputFallback(e);
                          })(e),
                      p(e) || (e._d = null),
                      e))
            );
          }
          function Dt(e, t, n, a, r) {
            var o,
              l = {};
            return (
              (!0 !== t && !1 !== t) || ((a = t), (t = void 0)),
              (!0 !== n && !1 !== n) || ((a = n), (n = void 0)),
              ((s(e) && d(e)) || (i(e) && 0 === e.length)) && (e = void 0),
              (l._isAMomentObject = !0),
              (l._useUTC = l._isUTC = r),
              (l._l = n),
              (l._i = e),
              (l._f = t),
              (l._strict = a),
              (o = new v(lt(kt(l))))._nextDay && (o.add(1, 'd'), (o._nextDay = void 0)),
              o
            );
          }
          function wt(e, t, n, a) {
            return Dt(e, t, n, a, !1);
          }
          (r.createFromInputFallback = k(
            'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
            function (e) {
              e._d = new Date(e._i + (e._useUTC ? ' UTC' : ''));
            },
          )),
            (r.ISO_8601 = function () {}),
            (r.RFC_2822 = function () {});
          var xt = k(
              'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
              function () {
                var e = wt.apply(null, arguments);
                return this.isValid() && e.isValid() ? (e < this ? this : e) : M();
              },
            ),
            Tt = k(
              'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
              function () {
                var e = wt.apply(null, arguments);
                return this.isValid() && e.isValid() ? (e > this ? this : e) : M();
              },
            );
          function St(e, t) {
            var n, a;
            if ((1 === t.length && i(t[0]) && (t = t[0]), !t.length)) return wt();
            for (n = t[0], a = 1; a < t.length; ++a) (t[a].isValid() && !t[a][e](n)) || (n = t[a]);
            return n;
          }
          var Ht = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];
          function jt(e) {
            var t = R(e),
              n = t.year || 0,
              a = t.quarter || 0,
              r = t.month || 0,
              i = t.week || t.isoWeek || 0,
              s = t.day || 0,
              d = t.hour || 0,
              l = t.minute || 0,
              u = t.second || 0,
              _ = t.millisecond || 0;
            (this._isValid = (function (e) {
              var t,
                n,
                a = !1;
              for (t in e) if (o(e, t) && (-1 === Me.call(Ht, t) || (null != e[t] && isNaN(e[t])))) return !1;
              for (n = 0; n < Ht.length; ++n)
                if (e[Ht[n]]) {
                  if (a) return !1;
                  parseFloat(e[Ht[n]]) !== G(e[Ht[n]]) && (a = !0);
                }
              return !0;
            })(t)),
              (this._milliseconds = +_ + 1e3 * u + 6e4 * l + 1e3 * d * 60 * 60),
              (this._days = +s + 7 * i),
              (this._months = +r + 3 * a + 12 * n),
              (this._data = {}),
              (this._locale = dt()),
              this._bubble();
          }
          function Pt(e) {
            return e instanceof jt;
          }
          function Ot(e) {
            return e < 0 ? -1 * Math.round(-1 * e) : Math.round(e);
          }
          function At(e, t) {
            W(e, 0, 0, function () {
              var e = this.utcOffset(),
                n = '+';
              return e < 0 && ((e = -e), (n = '-')), n + j(~~(e / 60), 2) + t + j(~~e % 60, 2);
            });
          }
          At('Z', ':'),
            At('ZZ', ''),
            me('Z', ce),
            me('ZZ', ce),
            ge(['Z', 'ZZ'], function (e, t, n) {
              (n._useUTC = !0), (n._tzm = Wt(ce, e));
            });
          var Ft = /([\+\-]|\d\d)/gi;
          function Wt(e, t) {
            var n,
              a,
              r = (t || '').match(e);
            return null === r
              ? null
              : 0 === (a = 60 * (n = ((r[r.length - 1] || []) + '').match(Ft) || ['-', 0, 0])[1] + G(n[2]))
              ? 0
              : '+' === n[0]
              ? a
              : -a;
          }
          function Ct(e, t) {
            var n, a;
            return t._isUTC
              ? ((n = t.clone()),
                (a = (Y(e) || _(e) ? e.valueOf() : wt(e).valueOf()) - n.valueOf()),
                n._d.setTime(n._d.valueOf() + a),
                r.updateOffset(n, !1),
                n)
              : wt(e).local();
          }
          function Et(e) {
            return -Math.round(e._d.getTimezoneOffset());
          }
          function zt() {
            return !!this.isValid() && this._isUTC && 0 === this._offset;
          }
          r.updateOffset = function () {};
          var It = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
            Nt =
              /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
          function Rt(e, t) {
            var n,
              a,
              r,
              i,
              s,
              d,
              l = e,
              _ = null;
            return (
              Pt(e)
                ? (l = { ms: e._milliseconds, d: e._days, M: e._months })
                : u(e) || !isNaN(+e)
                ? ((l = {}), t ? (l[t] = +e) : (l.milliseconds = +e))
                : (_ = It.exec(e))
                ? ((n = '-' === _[1] ? -1 : 1),
                  (l = {
                    y: 0,
                    d: G(_[2]) * n,
                    h: G(_[3]) * n,
                    m: G(_[4]) * n,
                    s: G(_[5]) * n,
                    ms: G(Ot(1e3 * _[6])) * n,
                  }))
                : (_ = Nt.exec(e))
                ? ((n = '-' === _[1] ? -1 : 1),
                  (l = {
                    y: Vt(_[2], n),
                    M: Vt(_[3], n),
                    w: Vt(_[4], n),
                    d: Vt(_[5], n),
                    h: Vt(_[6], n),
                    m: Vt(_[7], n),
                    s: Vt(_[8], n),
                  }))
                : null == l
                ? (l = {})
                : 'object' == typeof l &&
                  ('from' in l || 'to' in l) &&
                  ((i = wt(l.from)),
                  (s = wt(l.to)),
                  (r =
                    i.isValid() && s.isValid()
                      ? ((s = Ct(s, i)),
                        i.isBefore(s)
                          ? (d = Bt(i, s))
                          : (((d = Bt(s, i)).milliseconds = -d.milliseconds), (d.months = -d.months)),
                        d)
                      : { milliseconds: 0, months: 0 }),
                  ((l = {}).ms = r.milliseconds),
                  (l.M = r.months)),
              (a = new jt(l)),
              Pt(e) && o(e, '_locale') && (a._locale = e._locale),
              Pt(e) && o(e, '_isValid') && (a._isValid = e._isValid),
              a
            );
          }
          function Vt(e, t) {
            var n = e && parseFloat(e.replace(',', '.'));
            return (isNaN(n) ? 0 : n) * t;
          }
          function Bt(e, t) {
            var n = {};
            return (
              (n.months = t.month() - e.month() + 12 * (t.year() - e.year())),
              e.clone().add(n.months, 'M').isAfter(t) && --n.months,
              (n.milliseconds = +t - +e.clone().add(n.months, 'M')),
              n
            );
          }
          function Jt(e, t) {
            return function (n, a) {
              var r;
              return (
                null === a ||
                  isNaN(+a) ||
                  (x(
                    t,
                    'moment().' +
                      t +
                      '(period, number) is deprecated. Please use moment().' +
                      t +
                      '(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.',
                  ),
                  (r = n),
                  (n = a),
                  (a = r)),
                Ut(this, Rt(n, a), e),
                this
              );
            };
          }
          function Ut(e, t, n, a) {
            var i = t._milliseconds,
              s = Ot(t._days),
              o = Ot(t._months);
            e.isValid() &&
              ((a = null == a || a),
              o && Se(e, $(e, 'Month') + o * n),
              s && K(e, 'Date', $(e, 'Date') + s * n),
              i && e._d.setTime(e._d.valueOf() + i * n),
              a && r.updateOffset(e, s || o));
          }
          (Rt.fn = jt.prototype),
            (Rt.invalid = function () {
              return Rt(NaN);
            });
          var Gt = Jt(1, 'add'),
            qt = Jt(-1, 'subtract');
          function $t(e) {
            return 'string' == typeof e || e instanceof String;
          }
          function Kt(e) {
            return (
              Y(e) ||
              _(e) ||
              $t(e) ||
              u(e) ||
              (function (e) {
                var t = i(e),
                  n = !1;
                return (
                  t &&
                    (n =
                      0 ===
                      e.filter(function (t) {
                        return !u(t) && $t(e);
                      }).length),
                  t && n
                );
              })(e) ||
              (function (e) {
                var t,
                  n,
                  a = s(e) && !d(e),
                  r = !1,
                  i = [
                    'years',
                    'year',
                    'y',
                    'months',
                    'month',
                    'M',
                    'days',
                    'day',
                    'd',
                    'dates',
                    'date',
                    'D',
                    'hours',
                    'hour',
                    'h',
                    'minutes',
                    'minute',
                    'm',
                    'seconds',
                    'second',
                    's',
                    'milliseconds',
                    'millisecond',
                    'ms',
                  ];
                for (t = 0; t < i.length; t += 1) (n = i[t]), (r = r || o(e, n));
                return a && r;
              })(e) ||
              null == e
            );
          }
          function Zt(e) {
            var t,
              n = s(e) && !d(e),
              a = !1,
              r = ['sameDay', 'nextDay', 'lastDay', 'nextWeek', 'lastWeek', 'sameElse'];
            for (t = 0; t < r.length; t += 1) a = a || o(e, r[t]);
            return n && a;
          }
          function Xt(e, t) {
            if (e.date() < t.date()) return -Xt(t, e);
            var n = 12 * (t.year() - e.year()) + (t.month() - e.month()),
              a = e.clone().add(n, 'months');
            return (
              -(
                n +
                (t - a < 0
                  ? (t - a) / (a - e.clone().add(n - 1, 'months'))
                  : (t - a) / (e.clone().add(n + 1, 'months') - a))
              ) || 0
            );
          }
          function Qt(e) {
            var t;
            return void 0 === e ? this._locale._abbr : (null != (t = dt(e)) && (this._locale = t), this);
          }
          (r.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ'), (r.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]');
          var en = k(
            'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
            function (e) {
              return void 0 === e ? this.localeData() : this.locale(e);
            },
          );
          function tn() {
            return this._locale;
          }
          function nn(e, t) {
            return ((e % t) + t) % t;
          }
          function an(e, t, n) {
            return e < 100 && e >= 0 ? new Date(e + 400, t, n) - 126227808e5 : new Date(e, t, n).valueOf();
          }
          function rn(e, t, n) {
            return e < 100 && e >= 0 ? Date.UTC(e + 400, t, n) - 126227808e5 : Date.UTC(e, t, n);
          }
          function sn(e, t) {
            return t.erasAbbrRegex(e);
          }
          function on() {
            var e,
              t,
              n = [],
              a = [],
              r = [],
              i = [],
              s = this.eras();
            for (e = 0, t = s.length; e < t; ++e)
              a.push(pe(s[e].name)),
                n.push(pe(s[e].abbr)),
                r.push(pe(s[e].narrow)),
                i.push(pe(s[e].name)),
                i.push(pe(s[e].abbr)),
                i.push(pe(s[e].narrow));
            (this._erasRegex = new RegExp('^(' + i.join('|') + ')', 'i')),
              (this._erasNameRegex = new RegExp('^(' + a.join('|') + ')', 'i')),
              (this._erasAbbrRegex = new RegExp('^(' + n.join('|') + ')', 'i')),
              (this._erasNarrowRegex = new RegExp('^(' + r.join('|') + ')', 'i'));
          }
          function dn(e, t) {
            W(0, [e, e.length], 0, t);
          }
          function ln(e, t, n, a, r) {
            var i;
            return null == e ? Ee(this, a, r).year : (t > (i = ze(e, a, r)) && (t = i), un.call(this, e, t, n, a, r));
          }
          function un(e, t, n, a, r) {
            var i = Ce(e, t, n, a, r),
              s = Fe(i.year, 0, i.dayOfYear);
            return this.year(s.getUTCFullYear()), this.month(s.getUTCMonth()), this.date(s.getUTCDate()), this;
          }
          W('N', 0, 0, 'eraAbbr'),
            W('NN', 0, 0, 'eraAbbr'),
            W('NNN', 0, 0, 'eraAbbr'),
            W('NNNN', 0, 0, 'eraName'),
            W('NNNNN', 0, 0, 'eraNarrow'),
            W('y', ['y', 1], 'yo', 'eraYear'),
            W('y', ['yy', 2], 0, 'eraYear'),
            W('y', ['yyy', 3], 0, 'eraYear'),
            W('y', ['yyyy', 4], 0, 'eraYear'),
            me('N', sn),
            me('NN', sn),
            me('NNN', sn),
            me('NNNN', function (e, t) {
              return t.erasNameRegex(e);
            }),
            me('NNNNN', function (e, t) {
              return t.erasNarrowRegex(e);
            }),
            ge(['N', 'NN', 'NNN', 'NNNN', 'NNNNN'], function (e, t, n, a) {
              var r = n._locale.erasParse(e, a, n._strict);
              r ? (f(n).era = r) : (f(n).invalidEra = e);
            }),
            me('y', le),
            me('yy', le),
            me('yyy', le),
            me('yyyy', le),
            me('yo', function (e, t) {
              return t._eraYearOrdinalRegex || le;
            }),
            ge(['y', 'yy', 'yyy', 'yyyy'], 0),
            ge(['yo'], function (e, t, n, a) {
              var r;
              n._locale._eraYearOrdinalRegex && (r = e.match(n._locale._eraYearOrdinalRegex)),
                n._locale.eraYearOrdinalParse ? (t[0] = n._locale.eraYearOrdinalParse(e, r)) : (t[0] = parseInt(e, 10));
            }),
            W(0, ['gg', 2], 0, function () {
              return this.weekYear() % 100;
            }),
            W(0, ['GG', 2], 0, function () {
              return this.isoWeekYear() % 100;
            }),
            dn('gggg', 'weekYear'),
            dn('ggggg', 'weekYear'),
            dn('GGGG', 'isoWeekYear'),
            dn('GGGGG', 'isoWeekYear'),
            I('weekYear', 'gg'),
            I('isoWeekYear', 'GG'),
            B('weekYear', 1),
            B('isoWeekYear', 1),
            me('G', ue),
            me('g', ue),
            me('GG', ae, Q),
            me('gg', ae, Q),
            me('GGGG', oe, te),
            me('gggg', oe, te),
            me('GGGGG', de, ne),
            me('ggggg', de, ne),
            Le(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (e, t, n, a) {
              t[a.substr(0, 2)] = G(e);
            }),
            Le(['gg', 'GG'], function (e, t, n, a) {
              t[a] = r.parseTwoDigitYear(e);
            }),
            W('Q', 0, 'Qo', 'quarter'),
            I('quarter', 'Q'),
            B('quarter', 7),
            me('Q', X),
            ge('Q', function (e, t) {
              t[1] = 3 * (G(e) - 1);
            }),
            W('D', ['DD', 2], 'Do', 'date'),
            I('date', 'D'),
            B('date', 9),
            me('D', ae),
            me('DD', ae, Q),
            me('Do', function (e, t) {
              return e ? t._dayOfMonthOrdinalParse || t._ordinalParse : t._dayOfMonthOrdinalParseLenient;
            }),
            ge(['D', 'DD'], 2),
            ge('Do', function (e, t) {
              t[2] = G(e.match(ae)[0]);
            });
          var _n = q('Date', !0);
          W('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear'),
            I('dayOfYear', 'DDD'),
            B('dayOfYear', 4),
            me('DDD', se),
            me('DDDD', ee),
            ge(['DDD', 'DDDD'], function (e, t, n) {
              n._dayOfYear = G(e);
            }),
            W('m', ['mm', 2], 0, 'minute'),
            I('minute', 'm'),
            B('minute', 14),
            me('m', ae),
            me('mm', ae, Q),
            ge(['m', 'mm'], 4);
          var cn = q('Minutes', !1);
          W('s', ['ss', 2], 0, 'second'),
            I('second', 's'),
            B('second', 15),
            me('s', ae),
            me('ss', ae, Q),
            ge(['s', 'ss'], 5);
          var hn,
            mn,
            fn = q('Seconds', !1);
          for (
            W('S', 0, 0, function () {
              return ~~(this.millisecond() / 100);
            }),
              W(0, ['SS', 2], 0, function () {
                return ~~(this.millisecond() / 10);
              }),
              W(0, ['SSS', 3], 0, 'millisecond'),
              W(0, ['SSSS', 4], 0, function () {
                return 10 * this.millisecond();
              }),
              W(0, ['SSSSS', 5], 0, function () {
                return 100 * this.millisecond();
              }),
              W(0, ['SSSSSS', 6], 0, function () {
                return 1e3 * this.millisecond();
              }),
              W(0, ['SSSSSSS', 7], 0, function () {
                return 1e4 * this.millisecond();
              }),
              W(0, ['SSSSSSSS', 8], 0, function () {
                return 1e5 * this.millisecond();
              }),
              W(0, ['SSSSSSSSS', 9], 0, function () {
                return 1e6 * this.millisecond();
              }),
              I('millisecond', 'ms'),
              B('millisecond', 16),
              me('S', se, X),
              me('SS', se, Q),
              me('SSS', se, ee),
              hn = 'SSSS';
            hn.length <= 9;
            hn += 'S'
          )
            me(hn, le);
          function pn(e, t) {
            t[6] = G(1e3 * ('0.' + e));
          }
          for (hn = 'S'; hn.length <= 9; hn += 'S') ge(hn, pn);
          (mn = q('Milliseconds', !1)), W('z', 0, 0, 'zoneAbbr'), W('zz', 0, 0, 'zoneName');
          var Mn = v.prototype;
          function yn(e) {
            return e;
          }
          (Mn.add = Gt),
            (Mn.calendar = function (e, t) {
              1 === arguments.length &&
                (arguments[0]
                  ? Kt(arguments[0])
                    ? ((e = arguments[0]), (t = void 0))
                    : Zt(arguments[0]) && ((t = arguments[0]), (e = void 0))
                  : ((e = void 0), (t = void 0)));
              var n = e || wt(),
                a = Ct(n, this).startOf('day'),
                i = r.calendarFormat(this, a) || 'sameElse',
                s = t && (T(t[i]) ? t[i].call(this, n) : t[i]);
              return this.format(s || this.localeData().calendar(i, this, wt(n)));
            }),
            (Mn.clone = function () {
              return new v(this);
            }),
            (Mn.diff = function (e, t, n) {
              var a, r, i;
              if (!this.isValid()) return NaN;
              if (!(a = Ct(e, this)).isValid()) return NaN;
              switch (((r = 6e4 * (a.utcOffset() - this.utcOffset())), (t = N(t)))) {
                case 'year':
                  i = Xt(this, a) / 12;
                  break;
                case 'month':
                  i = Xt(this, a);
                  break;
                case 'quarter':
                  i = Xt(this, a) / 3;
                  break;
                case 'second':
                  i = (this - a) / 1e3;
                  break;
                case 'minute':
                  i = (this - a) / 6e4;
                  break;
                case 'hour':
                  i = (this - a) / 36e5;
                  break;
                case 'day':
                  i = (this - a - r) / 864e5;
                  break;
                case 'week':
                  i = (this - a - r) / 6048e5;
                  break;
                default:
                  i = this - a;
              }
              return n ? i : U(i);
            }),
            (Mn.endOf = function (e) {
              var t, n;
              if (void 0 === (e = N(e)) || 'millisecond' === e || !this.isValid()) return this;
              switch (((n = this._isUTC ? rn : an), e)) {
                case 'year':
                  t = n(this.year() + 1, 0, 1) - 1;
                  break;
                case 'quarter':
                  t = n(this.year(), this.month() - (this.month() % 3) + 3, 1) - 1;
                  break;
                case 'month':
                  t = n(this.year(), this.month() + 1, 1) - 1;
                  break;
                case 'week':
                  t = n(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                  break;
                case 'isoWeek':
                  t = n(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                  break;
                case 'day':
                case 'date':
                  t = n(this.year(), this.month(), this.date() + 1) - 1;
                  break;
                case 'hour':
                  (t = this._d.valueOf()), (t += 36e5 - nn(t + (this._isUTC ? 0 : 6e4 * this.utcOffset()), 36e5) - 1);
                  break;
                case 'minute':
                  (t = this._d.valueOf()), (t += 6e4 - nn(t, 6e4) - 1);
                  break;
                case 'second':
                  (t = this._d.valueOf()), (t += 1e3 - nn(t, 1e3) - 1);
              }
              return this._d.setTime(t), r.updateOffset(this, !0), this;
            }),
            (Mn.format = function (e) {
              e || (e = this.isUtc() ? r.defaultFormatUtc : r.defaultFormat);
              var t = C(this, e);
              return this.localeData().postformat(t);
            }),
            (Mn.from = function (e, t) {
              return this.isValid() && ((Y(e) && e.isValid()) || wt(e).isValid())
                ? Rt({ to: this, from: e }).locale(this.locale()).humanize(!t)
                : this.localeData().invalidDate();
            }),
            (Mn.fromNow = function (e) {
              return this.from(wt(), e);
            }),
            (Mn.to = function (e, t) {
              return this.isValid() && ((Y(e) && e.isValid()) || wt(e).isValid())
                ? Rt({ from: this, to: e }).locale(this.locale()).humanize(!t)
                : this.localeData().invalidDate();
            }),
            (Mn.toNow = function (e) {
              return this.to(wt(), e);
            }),
            (Mn.get = function (e) {
              return T(this[(e = N(e))]) ? this[e]() : this;
            }),
            (Mn.invalidAt = function () {
              return f(this).overflow;
            }),
            (Mn.isAfter = function (e, t) {
              var n = Y(e) ? e : wt(e);
              return (
                !(!this.isValid() || !n.isValid()) &&
                ('millisecond' === (t = N(t) || 'millisecond')
                  ? this.valueOf() > n.valueOf()
                  : n.valueOf() < this.clone().startOf(t).valueOf())
              );
            }),
            (Mn.isBefore = function (e, t) {
              var n = Y(e) ? e : wt(e);
              return (
                !(!this.isValid() || !n.isValid()) &&
                ('millisecond' === (t = N(t) || 'millisecond')
                  ? this.valueOf() < n.valueOf()
                  : this.clone().endOf(t).valueOf() < n.valueOf())
              );
            }),
            (Mn.isBetween = function (e, t, n, a) {
              var r = Y(e) ? e : wt(e),
                i = Y(t) ? t : wt(t);
              return (
                !!(this.isValid() && r.isValid() && i.isValid()) &&
                ('(' === (a = a || '()')[0] ? this.isAfter(r, n) : !this.isBefore(r, n)) &&
                (')' === a[1] ? this.isBefore(i, n) : !this.isAfter(i, n))
              );
            }),
            (Mn.isSame = function (e, t) {
              var n,
                a = Y(e) ? e : wt(e);
              return (
                !(!this.isValid() || !a.isValid()) &&
                ('millisecond' === (t = N(t) || 'millisecond')
                  ? this.valueOf() === a.valueOf()
                  : ((n = a.valueOf()), this.clone().startOf(t).valueOf() <= n && n <= this.clone().endOf(t).valueOf()))
              );
            }),
            (Mn.isSameOrAfter = function (e, t) {
              return this.isSame(e, t) || this.isAfter(e, t);
            }),
            (Mn.isSameOrBefore = function (e, t) {
              return this.isSame(e, t) || this.isBefore(e, t);
            }),
            (Mn.isValid = function () {
              return p(this);
            }),
            (Mn.lang = en),
            (Mn.locale = Qt),
            (Mn.localeData = tn),
            (Mn.max = Tt),
            (Mn.min = xt),
            (Mn.parsingFlags = function () {
              return h({}, f(this));
            }),
            (Mn.set = function (e, t) {
              if ('object' == typeof e) {
                var n,
                  a = (function (e) {
                    var t,
                      n = [];
                    for (t in e) o(e, t) && n.push({ unit: t, priority: V[t] });
                    return (
                      n.sort(function (e, t) {
                        return e.priority - t.priority;
                      }),
                      n
                    );
                  })((e = R(e)));
                for (n = 0; n < a.length; n++) this[a[n].unit](e[a[n].unit]);
              } else if (T(this[(e = N(e))])) return this[e](t);
              return this;
            }),
            (Mn.startOf = function (e) {
              var t, n;
              if (void 0 === (e = N(e)) || 'millisecond' === e || !this.isValid()) return this;
              switch (((n = this._isUTC ? rn : an), e)) {
                case 'year':
                  t = n(this.year(), 0, 1);
                  break;
                case 'quarter':
                  t = n(this.year(), this.month() - (this.month() % 3), 1);
                  break;
                case 'month':
                  t = n(this.year(), this.month(), 1);
                  break;
                case 'week':
                  t = n(this.year(), this.month(), this.date() - this.weekday());
                  break;
                case 'isoWeek':
                  t = n(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                  break;
                case 'day':
                case 'date':
                  t = n(this.year(), this.month(), this.date());
                  break;
                case 'hour':
                  (t = this._d.valueOf()), (t -= nn(t + (this._isUTC ? 0 : 6e4 * this.utcOffset()), 36e5));
                  break;
                case 'minute':
                  (t = this._d.valueOf()), (t -= nn(t, 6e4));
                  break;
                case 'second':
                  (t = this._d.valueOf()), (t -= nn(t, 1e3));
              }
              return this._d.setTime(t), r.updateOffset(this, !0), this;
            }),
            (Mn.subtract = qt),
            (Mn.toArray = function () {
              var e = this;
              return [e.year(), e.month(), e.date(), e.hour(), e.minute(), e.second(), e.millisecond()];
            }),
            (Mn.toObject = function () {
              var e = this;
              return {
                years: e.year(),
                months: e.month(),
                date: e.date(),
                hours: e.hours(),
                minutes: e.minutes(),
                seconds: e.seconds(),
                milliseconds: e.milliseconds(),
              };
            }),
            (Mn.toDate = function () {
              return new Date(this.valueOf());
            }),
            (Mn.toISOString = function (e) {
              if (!this.isValid()) return null;
              var t = !0 !== e,
                n = t ? this.clone().utc() : this;
              return n.year() < 0 || n.year() > 9999
                ? C(n, t ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ')
                : T(Date.prototype.toISOString)
                ? t
                  ? this.toDate().toISOString()
                  : new Date(this.valueOf() + 60 * this.utcOffset() * 1e3).toISOString().replace('Z', C(n, 'Z'))
                : C(n, t ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
            }),
            (Mn.inspect = function () {
              if (!this.isValid()) return 'moment.invalid(/* ' + this._i + ' */)';
              var e,
                t,
                n,
                a = 'moment',
                r = '';
              return (
                this.isLocal() || ((a = 0 === this.utcOffset() ? 'moment.utc' : 'moment.parseZone'), (r = 'Z')),
                (e = '[' + a + '("]'),
                (t = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY'),
                (n = r + '[")]'),
                this.format(e + t + '-MM-DD[T]HH:mm:ss.SSS' + n)
              );
            }),
            'undefined' != typeof Symbol &&
              null != Symbol.for &&
              (Mn[Symbol.for('nodejs.util.inspect.custom')] = function () {
                return 'Moment<' + this.format() + '>';
              }),
            (Mn.toJSON = function () {
              return this.isValid() ? this.toISOString() : null;
            }),
            (Mn.toString = function () {
              return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
            }),
            (Mn.unix = function () {
              return Math.floor(this.valueOf() / 1e3);
            }),
            (Mn.valueOf = function () {
              return this._d.valueOf() - 6e4 * (this._offset || 0);
            }),
            (Mn.creationData = function () {
              return {
                input: this._i,
                format: this._f,
                locale: this._locale,
                isUTC: this._isUTC,
                strict: this._strict,
              };
            }),
            (Mn.eraName = function () {
              var e,
                t,
                n,
                a = this.localeData().eras();
              for (e = 0, t = a.length; e < t; ++e) {
                if (((n = this.clone().startOf('day').valueOf()), a[e].since <= n && n <= a[e].until)) return a[e].name;
                if (a[e].until <= n && n <= a[e].since) return a[e].name;
              }
              return '';
            }),
            (Mn.eraNarrow = function () {
              var e,
                t,
                n,
                a = this.localeData().eras();
              for (e = 0, t = a.length; e < t; ++e) {
                if (((n = this.clone().startOf('day').valueOf()), a[e].since <= n && n <= a[e].until))
                  return a[e].narrow;
                if (a[e].until <= n && n <= a[e].since) return a[e].narrow;
              }
              return '';
            }),
            (Mn.eraAbbr = function () {
              var e,
                t,
                n,
                a = this.localeData().eras();
              for (e = 0, t = a.length; e < t; ++e) {
                if (((n = this.clone().startOf('day').valueOf()), a[e].since <= n && n <= a[e].until)) return a[e].abbr;
                if (a[e].until <= n && n <= a[e].since) return a[e].abbr;
              }
              return '';
            }),
            (Mn.eraYear = function () {
              var e,
                t,
                n,
                a,
                i = this.localeData().eras();
              for (e = 0, t = i.length; e < t; ++e)
                if (
                  ((n = i[e].since <= i[e].until ? 1 : -1),
                  (a = this.clone().startOf('day').valueOf()),
                  (i[e].since <= a && a <= i[e].until) || (i[e].until <= a && a <= i[e].since))
                )
                  return (this.year() - r(i[e].since).year()) * n + i[e].offset;
              return this.year();
            }),
            (Mn.year = Oe),
            (Mn.isLeapYear = function () {
              return J(this.year());
            }),
            (Mn.weekYear = function (e) {
              return ln.call(
                this,
                e,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy,
              );
            }),
            (Mn.isoWeekYear = function (e) {
              return ln.call(this, e, this.isoWeek(), this.isoWeekday(), 1, 4);
            }),
            (Mn.quarter = Mn.quarters =
              function (e) {
                return null == e ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (e - 1) + (this.month() % 3));
              }),
            (Mn.month = He),
            (Mn.daysInMonth = function () {
              return Ye(this.year(), this.month());
            }),
            (Mn.week = Mn.weeks =
              function (e) {
                var t = this.localeData().week(this);
                return null == e ? t : this.add(7 * (e - t), 'd');
              }),
            (Mn.isoWeek = Mn.isoWeeks =
              function (e) {
                var t = Ee(this, 1, 4).week;
                return null == e ? t : this.add(7 * (e - t), 'd');
              }),
            (Mn.weeksInYear = function () {
              var e = this.localeData()._week;
              return ze(this.year(), e.dow, e.doy);
            }),
            (Mn.weeksInWeekYear = function () {
              var e = this.localeData()._week;
              return ze(this.weekYear(), e.dow, e.doy);
            }),
            (Mn.isoWeeksInYear = function () {
              return ze(this.year(), 1, 4);
            }),
            (Mn.isoWeeksInISOWeekYear = function () {
              return ze(this.isoWeekYear(), 1, 4);
            }),
            (Mn.date = _n),
            (Mn.day = Mn.days =
              function (e) {
                if (!this.isValid()) return null != e ? this : NaN;
                var t = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
                return null != e
                  ? ((e = (function (e, t) {
                      return 'string' != typeof e
                        ? e
                        : isNaN(e)
                        ? 'number' == typeof (e = t.weekdaysParse(e))
                          ? e
                          : null
                        : parseInt(e, 10);
                    })(e, this.localeData())),
                    this.add(e - t, 'd'))
                  : t;
              }),
            (Mn.weekday = function (e) {
              if (!this.isValid()) return null != e ? this : NaN;
              var t = (this.day() + 7 - this.localeData()._week.dow) % 7;
              return null == e ? t : this.add(e - t, 'd');
            }),
            (Mn.isoWeekday = function (e) {
              if (!this.isValid()) return null != e ? this : NaN;
              if (null != e) {
                var t = (function (e, t) {
                  return 'string' == typeof e ? t.weekdaysParse(e) % 7 || 7 : isNaN(e) ? null : e;
                })(e, this.localeData());
                return this.day(this.day() % 7 ? t : t - 7);
              }
              return this.day() || 7;
            }),
            (Mn.dayOfYear = function (e) {
              var t = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
              return null == e ? t : this.add(e - t, 'd');
            }),
            (Mn.hour = Mn.hours = Qe),
            (Mn.minute = Mn.minutes = cn),
            (Mn.second = Mn.seconds = fn),
            (Mn.millisecond = Mn.milliseconds = mn),
            (Mn.utcOffset = function (e, t, n) {
              var a,
                i = this._offset || 0;
              if (!this.isValid()) return null != e ? this : NaN;
              if (null != e) {
                if ('string' == typeof e) {
                  if (null === (e = Wt(ce, e))) return this;
                } else Math.abs(e) < 16 && !n && (e *= 60);
                return (
                  !this._isUTC && t && (a = Et(this)),
                  (this._offset = e),
                  (this._isUTC = !0),
                  null != a && this.add(a, 'm'),
                  i !== e &&
                    (!t || this._changeInProgress
                      ? Ut(this, Rt(e - i, 'm'), 1, !1)
                      : this._changeInProgress ||
                        ((this._changeInProgress = !0), r.updateOffset(this, !0), (this._changeInProgress = null))),
                  this
                );
              }
              return this._isUTC ? i : Et(this);
            }),
            (Mn.utc = function (e) {
              return this.utcOffset(0, e);
            }),
            (Mn.local = function (e) {
              return this._isUTC && (this.utcOffset(0, e), (this._isUTC = !1), e && this.subtract(Et(this), 'm')), this;
            }),
            (Mn.parseZone = function () {
              if (null != this._tzm) this.utcOffset(this._tzm, !1, !0);
              else if ('string' == typeof this._i) {
                var e = Wt(_e, this._i);
                null != e ? this.utcOffset(e) : this.utcOffset(0, !0);
              }
              return this;
            }),
            (Mn.hasAlignedHourOffset = function (e) {
              return !!this.isValid() && ((e = e ? wt(e).utcOffset() : 0), (this.utcOffset() - e) % 60 == 0);
            }),
            (Mn.isDST = function () {
              return (
                this.utcOffset() > this.clone().month(0).utcOffset() ||
                this.utcOffset() > this.clone().month(5).utcOffset()
              );
            }),
            (Mn.isLocal = function () {
              return !!this.isValid() && !this._isUTC;
            }),
            (Mn.isUtcOffset = function () {
              return !!this.isValid() && this._isUTC;
            }),
            (Mn.isUtc = zt),
            (Mn.isUTC = zt),
            (Mn.zoneAbbr = function () {
              return this._isUTC ? 'UTC' : '';
            }),
            (Mn.zoneName = function () {
              return this._isUTC ? 'Coordinated Universal Time' : '';
            }),
            (Mn.dates = k('dates accessor is deprecated. Use date instead.', _n)),
            (Mn.months = k('months accessor is deprecated. Use month instead', He)),
            (Mn.years = k('years accessor is deprecated. Use year instead', Oe)),
            (Mn.zone = k(
              'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
              function (e, t) {
                return null != e ? ('string' != typeof e && (e = -e), this.utcOffset(e, t), this) : -this.utcOffset();
              },
            )),
            (Mn.isDSTShifted = k(
              'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
              function () {
                if (!l(this._isDSTShifted)) return this._isDSTShifted;
                var e,
                  t = {};
                return (
                  L(t, this),
                  (t = kt(t))._a
                    ? ((e = t._isUTC ? m(t._a) : wt(t._a)),
                      (this._isDSTShifted =
                        this.isValid() &&
                        (function (e, t, n) {
                          var a,
                            r = Math.min(e.length, t.length),
                            i = Math.abs(e.length - t.length),
                            s = 0;
                          for (a = 0; a < r; a++) ((n && e[a] !== t[a]) || (!n && G(e[a]) !== G(t[a]))) && s++;
                          return s + i;
                        })(t._a, e.toArray()) > 0))
                    : (this._isDSTShifted = !1),
                  this._isDSTShifted
                );
              },
            ));
          var gn = H.prototype;
          function Ln(e, t, n, a) {
            var r = dt(),
              i = m().set(a, t);
            return r[n](i, e);
          }
          function vn(e, t, n) {
            if ((u(e) && ((t = e), (e = void 0)), (e = e || ''), null != t)) return Ln(e, t, n, 'month');
            var a,
              r = [];
            for (a = 0; a < 12; a++) r[a] = Ln(e, a, n, 'month');
            return r;
          }
          function Yn(e, t, n, a) {
            'boolean' == typeof e
              ? (u(t) && ((n = t), (t = void 0)), (t = t || ''))
              : ((n = t = e), (e = !1), u(t) && ((n = t), (t = void 0)), (t = t || ''));
            var r,
              i = dt(),
              s = e ? i._week.dow : 0,
              o = [];
            if (null != n) return Ln(t, (n + s) % 7, a, 'day');
            for (r = 0; r < 7; r++) o[r] = Ln(t, (r + s) % 7, a, 'day');
            return o;
          }
          (gn.calendar = function (e, t, n) {
            var a = this._calendar[e] || this._calendar.sameElse;
            return T(a) ? a.call(t, n) : a;
          }),
            (gn.longDateFormat = function (e) {
              var t = this._longDateFormat[e],
                n = this._longDateFormat[e.toUpperCase()];
              return t || !n
                ? t
                : ((this._longDateFormat[e] = n
                    .match(P)
                    .map(function (e) {
                      return 'MMMM' === e || 'MM' === e || 'DD' === e || 'dddd' === e ? e.slice(1) : e;
                    })
                    .join('')),
                  this._longDateFormat[e]);
            }),
            (gn.invalidDate = function () {
              return this._invalidDate;
            }),
            (gn.ordinal = function (e) {
              return this._ordinal.replace('%d', e);
            }),
            (gn.preparse = yn),
            (gn.postformat = yn),
            (gn.relativeTime = function (e, t, n, a) {
              var r = this._relativeTime[n];
              return T(r) ? r(e, t, n, a) : r.replace(/%d/i, e);
            }),
            (gn.pastFuture = function (e, t) {
              var n = this._relativeTime[e > 0 ? 'future' : 'past'];
              return T(n) ? n(t) : n.replace(/%s/i, t);
            }),
            (gn.set = function (e) {
              var t, n;
              for (n in e) o(e, n) && (T((t = e[n])) ? (this[n] = t) : (this['_' + n] = t));
              (this._config = e),
                (this._dayOfMonthOrdinalParseLenient = new RegExp(
                  (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + '|' + /\d{1,2}/.source,
                ));
            }),
            (gn.eras = function (e, t) {
              var n,
                a,
                i,
                s = this._eras || dt('en')._eras;
              for (n = 0, a = s.length; n < a; ++n) {
                switch (typeof s[n].since) {
                  case 'string':
                    (i = r(s[n].since).startOf('day')), (s[n].since = i.valueOf());
                }
                switch (typeof s[n].until) {
                  case 'undefined':
                    s[n].until = 1 / 0;
                    break;
                  case 'string':
                    (i = r(s[n].until).startOf('day').valueOf()), (s[n].until = i.valueOf());
                }
              }
              return s;
            }),
            (gn.erasParse = function (e, t, n) {
              var a,
                r,
                i,
                s,
                o,
                d = this.eras();
              for (e = e.toUpperCase(), a = 0, r = d.length; a < r; ++a)
                if (((i = d[a].name.toUpperCase()), (s = d[a].abbr.toUpperCase()), (o = d[a].narrow.toUpperCase()), n))
                  switch (t) {
                    case 'N':
                    case 'NN':
                    case 'NNN':
                      if (s === e) return d[a];
                      break;
                    case 'NNNN':
                      if (i === e) return d[a];
                      break;
                    case 'NNNNN':
                      if (o === e) return d[a];
                  }
                else if ([i, s, o].indexOf(e) >= 0) return d[a];
            }),
            (gn.erasConvertYear = function (e, t) {
              var n = e.since <= e.until ? 1 : -1;
              return void 0 === t ? r(e.since).year() : r(e.since).year() + (t - e.offset) * n;
            }),
            (gn.erasAbbrRegex = function (e) {
              return o(this, '_erasAbbrRegex') || on.call(this), e ? this._erasAbbrRegex : this._erasRegex;
            }),
            (gn.erasNameRegex = function (e) {
              return o(this, '_erasNameRegex') || on.call(this), e ? this._erasNameRegex : this._erasRegex;
            }),
            (gn.erasNarrowRegex = function (e) {
              return o(this, '_erasNarrowRegex') || on.call(this), e ? this._erasNarrowRegex : this._erasRegex;
            }),
            (gn.months = function (e, t) {
              return e
                ? i(this._months)
                  ? this._months[e.month()]
                  : this._months[(this._months.isFormat || De).test(t) ? 'format' : 'standalone'][e.month()]
                : i(this._months)
                ? this._months
                : this._months.standalone;
            }),
            (gn.monthsShort = function (e, t) {
              return e
                ? i(this._monthsShort)
                  ? this._monthsShort[e.month()]
                  : this._monthsShort[De.test(t) ? 'format' : 'standalone'][e.month()]
                : i(this._monthsShort)
                ? this._monthsShort
                : this._monthsShort.standalone;
            }),
            (gn.monthsParse = function (e, t, n) {
              var a, r, i;
              if (this._monthsParseExact) return Te.call(this, e, t, n);
              for (
                this._monthsParse ||
                  ((this._monthsParse = []), (this._longMonthsParse = []), (this._shortMonthsParse = [])),
                  a = 0;
                a < 12;
                a++
              ) {
                if (
                  ((r = m([2e3, a])),
                  n &&
                    !this._longMonthsParse[a] &&
                    ((this._longMonthsParse[a] = new RegExp('^' + this.months(r, '').replace('.', '') + '$', 'i')),
                    (this._shortMonthsParse[a] = new RegExp(
                      '^' + this.monthsShort(r, '').replace('.', '') + '$',
                      'i',
                    ))),
                  n ||
                    this._monthsParse[a] ||
                    ((i = '^' + this.months(r, '') + '|^' + this.monthsShort(r, '')),
                    (this._monthsParse[a] = new RegExp(i.replace('.', ''), 'i'))),
                  n && 'MMMM' === t && this._longMonthsParse[a].test(e))
                )
                  return a;
                if (n && 'MMM' === t && this._shortMonthsParse[a].test(e)) return a;
                if (!n && this._monthsParse[a].test(e)) return a;
              }
            }),
            (gn.monthsRegex = function (e) {
              return this._monthsParseExact
                ? (o(this, '_monthsRegex') || je.call(this), e ? this._monthsStrictRegex : this._monthsRegex)
                : (o(this, '_monthsRegex') || (this._monthsRegex = xe),
                  this._monthsStrictRegex && e ? this._monthsStrictRegex : this._monthsRegex);
            }),
            (gn.monthsShortRegex = function (e) {
              return this._monthsParseExact
                ? (o(this, '_monthsRegex') || je.call(this), e ? this._monthsShortStrictRegex : this._monthsShortRegex)
                : (o(this, '_monthsShortRegex') || (this._monthsShortRegex = we),
                  this._monthsShortStrictRegex && e ? this._monthsShortStrictRegex : this._monthsShortRegex);
            }),
            (gn.week = function (e) {
              return Ee(e, this._week.dow, this._week.doy).week;
            }),
            (gn.firstDayOfYear = function () {
              return this._week.doy;
            }),
            (gn.firstDayOfWeek = function () {
              return this._week.dow;
            }),
            (gn.weekdays = function (e, t) {
              var n = i(this._weekdays)
                ? this._weekdays
                : this._weekdays[e && !0 !== e && this._weekdays.isFormat.test(t) ? 'format' : 'standalone'];
              return !0 === e ? Ie(n, this._week.dow) : e ? n[e.day()] : n;
            }),
            (gn.weekdaysMin = function (e) {
              return !0 === e
                ? Ie(this._weekdaysMin, this._week.dow)
                : e
                ? this._weekdaysMin[e.day()]
                : this._weekdaysMin;
            }),
            (gn.weekdaysShort = function (e) {
              return !0 === e
                ? Ie(this._weekdaysShort, this._week.dow)
                : e
                ? this._weekdaysShort[e.day()]
                : this._weekdaysShort;
            }),
            (gn.weekdaysParse = function (e, t, n) {
              var a, r, i;
              if (this._weekdaysParseExact) return Ge.call(this, e, t, n);
              for (
                this._weekdaysParse ||
                  ((this._weekdaysParse = []),
                  (this._minWeekdaysParse = []),
                  (this._shortWeekdaysParse = []),
                  (this._fullWeekdaysParse = [])),
                  a = 0;
                a < 7;
                a++
              ) {
                if (
                  ((r = m([2e3, 1]).day(a)),
                  n &&
                    !this._fullWeekdaysParse[a] &&
                    ((this._fullWeekdaysParse[a] = new RegExp(
                      '^' + this.weekdays(r, '').replace('.', '\\.?') + '$',
                      'i',
                    )),
                    (this._shortWeekdaysParse[a] = new RegExp(
                      '^' + this.weekdaysShort(r, '').replace('.', '\\.?') + '$',
                      'i',
                    )),
                    (this._minWeekdaysParse[a] = new RegExp(
                      '^' + this.weekdaysMin(r, '').replace('.', '\\.?') + '$',
                      'i',
                    ))),
                  this._weekdaysParse[a] ||
                    ((i =
                      '^' + this.weekdays(r, '') + '|^' + this.weekdaysShort(r, '') + '|^' + this.weekdaysMin(r, '')),
                    (this._weekdaysParse[a] = new RegExp(i.replace('.', ''), 'i'))),
                  n && 'dddd' === t && this._fullWeekdaysParse[a].test(e))
                )
                  return a;
                if (n && 'ddd' === t && this._shortWeekdaysParse[a].test(e)) return a;
                if (n && 'dd' === t && this._minWeekdaysParse[a].test(e)) return a;
                if (!n && this._weekdaysParse[a].test(e)) return a;
              }
            }),
            (gn.weekdaysRegex = function (e) {
              return this._weekdaysParseExact
                ? (o(this, '_weekdaysRegex') || qe.call(this), e ? this._weekdaysStrictRegex : this._weekdaysRegex)
                : (o(this, '_weekdaysRegex') || (this._weekdaysRegex = Be),
                  this._weekdaysStrictRegex && e ? this._weekdaysStrictRegex : this._weekdaysRegex);
            }),
            (gn.weekdaysShortRegex = function (e) {
              return this._weekdaysParseExact
                ? (o(this, '_weekdaysRegex') || qe.call(this),
                  e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex)
                : (o(this, '_weekdaysShortRegex') || (this._weekdaysShortRegex = Je),
                  this._weekdaysShortStrictRegex && e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex);
            }),
            (gn.weekdaysMinRegex = function (e) {
              return this._weekdaysParseExact
                ? (o(this, '_weekdaysRegex') || qe.call(this),
                  e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex)
                : (o(this, '_weekdaysMinRegex') || (this._weekdaysMinRegex = Ue),
                  this._weekdaysMinStrictRegex && e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex);
            }),
            (gn.isPM = function (e) {
              return 'p' === (e + '').toLowerCase().charAt(0);
            }),
            (gn.meridiem = function (e, t, n) {
              return e > 11 ? (n ? 'pm' : 'PM') : n ? 'am' : 'AM';
            }),
            st('en', {
              eras: [
                { since: '0001-01-01', until: 1 / 0, offset: 1, name: 'Anno Domini', narrow: 'AD', abbr: 'AD' },
                { since: '0000-12-31', until: -1 / 0, offset: 1, name: 'Before Christ', narrow: 'BC', abbr: 'BC' },
              ],
              dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
              ordinal: function (e) {
                var t = e % 10;
                return e + (1 === G((e % 100) / 10) ? 'th' : 1 === t ? 'st' : 2 === t ? 'nd' : 3 === t ? 'rd' : 'th');
              },
            }),
            (r.lang = k('moment.lang is deprecated. Use moment.locale instead.', st)),
            (r.langData = k('moment.langData is deprecated. Use moment.localeData instead.', dt));
          var bn = Math.abs;
          function kn(e, t, n, a) {
            var r = Rt(t, n);
            return (
              (e._milliseconds += a * r._milliseconds),
              (e._days += a * r._days),
              (e._months += a * r._months),
              e._bubble()
            );
          }
          function Dn(e) {
            return e < 0 ? Math.floor(e) : Math.ceil(e);
          }
          function wn(e) {
            return (4800 * e) / 146097;
          }
          function xn(e) {
            return (146097 * e) / 4800;
          }
          function Tn(e) {
            return function () {
              return this.as(e);
            };
          }
          var Sn = Tn('ms'),
            Hn = Tn('s'),
            jn = Tn('m'),
            Pn = Tn('h'),
            On = Tn('d'),
            An = Tn('w'),
            Fn = Tn('M'),
            Wn = Tn('Q'),
            Cn = Tn('y');
          function En(e) {
            return function () {
              return this.isValid() ? this._data[e] : NaN;
            };
          }
          var zn = En('milliseconds'),
            In = En('seconds'),
            Nn = En('minutes'),
            Rn = En('hours'),
            Vn = En('days'),
            Bn = En('months'),
            Jn = En('years'),
            Un = Math.round,
            Gn = { ss: 44, s: 45, m: 45, h: 22, d: 26, w: null, M: 11 };
          function qn(e, t, n, a, r) {
            return r.relativeTime(t || 1, !!n, e, a);
          }
          var $n = Math.abs;
          function Kn(e) {
            return (e > 0) - (e < 0) || +e;
          }
          function Zn() {
            if (!this.isValid()) return this.localeData().invalidDate();
            var e,
              t,
              n,
              a,
              r,
              i,
              s,
              o,
              d = $n(this._milliseconds) / 1e3,
              l = $n(this._days),
              u = $n(this._months),
              _ = this.asSeconds();
            return _
              ? ((e = U(d / 60)),
                (t = U(e / 60)),
                (d %= 60),
                (e %= 60),
                (n = U(u / 12)),
                (u %= 12),
                (a = d ? d.toFixed(3).replace(/\.?0+$/, '') : ''),
                (r = _ < 0 ? '-' : ''),
                (i = Kn(this._months) !== Kn(_) ? '-' : ''),
                (s = Kn(this._days) !== Kn(_) ? '-' : ''),
                (o = Kn(this._milliseconds) !== Kn(_) ? '-' : ''),
                r +
                  'P' +
                  (n ? i + n + 'Y' : '') +
                  (u ? i + u + 'M' : '') +
                  (l ? s + l + 'D' : '') +
                  (t || e || d ? 'T' : '') +
                  (t ? o + t + 'H' : '') +
                  (e ? o + e + 'M' : '') +
                  (d ? o + a + 'S' : ''))
              : 'P0D';
          }
          var Xn = jt.prototype;
          return (
            (Xn.isValid = function () {
              return this._isValid;
            }),
            (Xn.abs = function () {
              var e = this._data;
              return (
                (this._milliseconds = bn(this._milliseconds)),
                (this._days = bn(this._days)),
                (this._months = bn(this._months)),
                (e.milliseconds = bn(e.milliseconds)),
                (e.seconds = bn(e.seconds)),
                (e.minutes = bn(e.minutes)),
                (e.hours = bn(e.hours)),
                (e.months = bn(e.months)),
                (e.years = bn(e.years)),
                this
              );
            }),
            (Xn.add = function (e, t) {
              return kn(this, e, t, 1);
            }),
            (Xn.subtract = function (e, t) {
              return kn(this, e, t, -1);
            }),
            (Xn.as = function (e) {
              if (!this.isValid()) return NaN;
              var t,
                n,
                a = this._milliseconds;
              if ('month' === (e = N(e)) || 'quarter' === e || 'year' === e)
                switch (((t = this._days + a / 864e5), (n = this._months + wn(t)), e)) {
                  case 'month':
                    return n;
                  case 'quarter':
                    return n / 3;
                  case 'year':
                    return n / 12;
                }
              else
                switch (((t = this._days + Math.round(xn(this._months))), e)) {
                  case 'week':
                    return t / 7 + a / 6048e5;
                  case 'day':
                    return t + a / 864e5;
                  case 'hour':
                    return 24 * t + a / 36e5;
                  case 'minute':
                    return 1440 * t + a / 6e4;
                  case 'second':
                    return 86400 * t + a / 1e3;
                  case 'millisecond':
                    return Math.floor(864e5 * t) + a;
                  default:
                    throw new Error('Unknown unit ' + e);
                }
            }),
            (Xn.asMilliseconds = Sn),
            (Xn.asSeconds = Hn),
            (Xn.asMinutes = jn),
            (Xn.asHours = Pn),
            (Xn.asDays = On),
            (Xn.asWeeks = An),
            (Xn.asMonths = Fn),
            (Xn.asQuarters = Wn),
            (Xn.asYears = Cn),
            (Xn.valueOf = function () {
              return this.isValid()
                ? this._milliseconds +
                    864e5 * this._days +
                    (this._months % 12) * 2592e6 +
                    31536e6 * G(this._months / 12)
                : NaN;
            }),
            (Xn._bubble = function () {
              var e,
                t,
                n,
                a,
                r,
                i = this._milliseconds,
                s = this._days,
                o = this._months,
                d = this._data;
              return (
                (i >= 0 && s >= 0 && o >= 0) ||
                  (i <= 0 && s <= 0 && o <= 0) ||
                  ((i += 864e5 * Dn(xn(o) + s)), (s = 0), (o = 0)),
                (d.milliseconds = i % 1e3),
                (e = U(i / 1e3)),
                (d.seconds = e % 60),
                (t = U(e / 60)),
                (d.minutes = t % 60),
                (n = U(t / 60)),
                (d.hours = n % 24),
                (s += U(n / 24)),
                (r = U(wn(s))),
                (o += r),
                (s -= Dn(xn(r))),
                (a = U(o / 12)),
                (o %= 12),
                (d.days = s),
                (d.months = o),
                (d.years = a),
                this
              );
            }),
            (Xn.clone = function () {
              return Rt(this);
            }),
            (Xn.get = function (e) {
              return (e = N(e)), this.isValid() ? this[e + 's']() : NaN;
            }),
            (Xn.milliseconds = zn),
            (Xn.seconds = In),
            (Xn.minutes = Nn),
            (Xn.hours = Rn),
            (Xn.days = Vn),
            (Xn.weeks = function () {
              return U(this.days() / 7);
            }),
            (Xn.months = Bn),
            (Xn.years = Jn),
            (Xn.humanize = function (e, t) {
              if (!this.isValid()) return this.localeData().invalidDate();
              var n,
                a,
                r = !1,
                i = Gn;
              return (
                'object' == typeof e && ((t = e), (e = !1)),
                'boolean' == typeof e && (r = e),
                'object' == typeof t &&
                  ((i = Object.assign({}, Gn, t)), null != t.s && null == t.ss && (i.ss = t.s - 1)),
                (n = this.localeData()),
                (a = (function (e, t, n, a) {
                  var r = Rt(e).abs(),
                    i = Un(r.as('s')),
                    s = Un(r.as('m')),
                    o = Un(r.as('h')),
                    d = Un(r.as('d')),
                    l = Un(r.as('M')),
                    u = Un(r.as('w')),
                    _ = Un(r.as('y')),
                    c =
                      (i <= n.ss && ['s', i]) ||
                      (i < n.s && ['ss', i]) ||
                      (s <= 1 && ['m']) ||
                      (s < n.m && ['mm', s]) ||
                      (o <= 1 && ['h']) ||
                      (o < n.h && ['hh', o]) ||
                      (d <= 1 && ['d']) ||
                      (d < n.d && ['dd', d]);
                  return (
                    null != n.w && (c = c || (u <= 1 && ['w']) || (u < n.w && ['ww', u])),
                    ((c = c || (l <= 1 && ['M']) || (l < n.M && ['MM', l]) || (_ <= 1 && ['y']) || ['yy', _])[2] = t),
                    (c[3] = +e > 0),
                    (c[4] = a),
                    qn.apply(null, c)
                  );
                })(this, !r, i, n)),
                r && (a = n.pastFuture(+this, a)),
                n.postformat(a)
              );
            }),
            (Xn.toISOString = Zn),
            (Xn.toString = Zn),
            (Xn.toJSON = Zn),
            (Xn.locale = Qt),
            (Xn.localeData = tn),
            (Xn.toIsoString = k(
              'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
              Zn,
            )),
            (Xn.lang = en),
            W('X', 0, 0, 'unix'),
            W('x', 0, 0, 'valueOf'),
            me('x', ue),
            me('X', /[+-]?\d+(\.\d{1,3})?/),
            ge('X', function (e, t, n) {
              n._d = new Date(1e3 * parseFloat(e));
            }),
            ge('x', function (e, t, n) {
              n._d = new Date(G(e));
            }),
            //! moment.js
            (r.version = '2.29.1'),
            (t = wt),
            (r.fn = Mn),
            (r.min = function () {
              var e = [].slice.call(arguments, 0);
              return St('isBefore', e);
            }),
            (r.max = function () {
              var e = [].slice.call(arguments, 0);
              return St('isAfter', e);
            }),
            (r.now = function () {
              return Date.now ? Date.now() : +new Date();
            }),
            (r.utc = m),
            (r.unix = function (e) {
              return wt(1e3 * e);
            }),
            (r.months = function (e, t) {
              return vn(e, t, 'months');
            }),
            (r.isDate = _),
            (r.locale = st),
            (r.invalid = M),
            (r.duration = Rt),
            (r.isMoment = Y),
            (r.weekdays = function (e, t, n) {
              return Yn(e, t, n, 'weekdays');
            }),
            (r.parseZone = function () {
              return wt.apply(null, arguments).parseZone();
            }),
            (r.localeData = dt),
            (r.isDuration = Pt),
            (r.monthsShort = function (e, t) {
              return vn(e, t, 'monthsShort');
            }),
            (r.weekdaysMin = function (e, t, n) {
              return Yn(e, t, n, 'weekdaysMin');
            }),
            (r.defineLocale = ot),
            (r.updateLocale = function (e, t) {
              if (null != t) {
                var n,
                  a,
                  r = et;
                null != tt[e] && null != tt[e].parentLocale
                  ? tt[e].set(S(tt[e]._config, t))
                  : (null != (a = it(e)) && (r = a._config),
                    (t = S(r, t)),
                    null == a && (t.abbr = e),
                    ((n = new H(t)).parentLocale = tt[e]),
                    (tt[e] = n)),
                  st(e);
              } else
                null != tt[e] &&
                  (null != tt[e].parentLocale
                    ? ((tt[e] = tt[e].parentLocale), e === st() && st(e))
                    : null != tt[e] && delete tt[e]);
              return tt[e];
            }),
            (r.locales = function () {
              return D(tt);
            }),
            (r.weekdaysShort = function (e, t, n) {
              return Yn(e, t, n, 'weekdaysShort');
            }),
            (r.normalizeUnits = N),
            (r.relativeTimeRounding = function (e) {
              return void 0 === e ? Un : 'function' == typeof e && ((Un = e), !0);
            }),
            (r.relativeTimeThreshold = function (e, t) {
              return void 0 !== Gn[e] && (void 0 === t ? Gn[e] : ((Gn[e] = t), 's' === e && (Gn.ss = t - 1), !0));
            }),
            (r.calendarFormat = function (e, t) {
              var n = e.diff(t, 'days', !0);
              return n < -6
                ? 'sameElse'
                : n < -1
                ? 'lastWeek'
                : n < 0
                ? 'lastDay'
                : n < 1
                ? 'sameDay'
                : n < 2
                ? 'nextDay'
                : n < 7
                ? 'nextWeek'
                : 'sameElse';
            }),
            (r.prototype = Mn),
            (r.HTML5_FMT = {
              DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',
              DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',
              DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',
              DATE: 'YYYY-MM-DD',
              TIME: 'HH:mm',
              TIME_SECONDS: 'HH:mm:ss',
              TIME_MS: 'HH:mm:ss.SSS',
              WEEK: 'GGGG-[W]WW',
              MONTH: 'YYYY-MM',
            }),
            r
          );
        })();
      }.call(this, n(71)(e)));
    },
    1782: function (e, t, n) {
      var a = n(1939),
        r = 'object' == typeof self && self && self.Object === Object && self,
        i = a || r || Function('return this')();
      e.exports = i;
    },
    1783: function (e, t) {
      var n = Array.isArray;
      e.exports = n;
    },
    1784: function (e, t, n) {
      var a = n(1965),
        r = n(1970);
      e.exports = function (e, t) {
        var n = r(e, t);
        return a(n) ? n : void 0;
      };
    },
    1785: function (e, t, n) {
      var a = n(1789),
        r = n(1966),
        i = n(1967),
        s = a ? a.toStringTag : void 0;
      e.exports = function (e) {
        return null == e ? (void 0 === e ? '[object Undefined]' : '[object Null]') : s && s in Object(e) ? r(e) : i(e);
      };
    },
    1786: function (e, t) {
      e.exports = function (e) {
        return null != e && 'object' == typeof e;
      };
    },
    1787: function (e, t, n) {
      var a = n(1955),
        r = n(1956),
        i = n(1957),
        s = n(1958),
        o = n(1959);
      function d(e) {
        var t = -1,
          n = null == e ? 0 : e.length;
        for (this.clear(); ++t < n; ) {
          var a = e[t];
          this.set(a[0], a[1]);
        }
      }
      (d.prototype.clear = a),
        (d.prototype.delete = r),
        (d.prototype.get = i),
        (d.prototype.has = s),
        (d.prototype.set = o),
        (e.exports = d);
    },
    1788: function (e, t, n) {
      var a = n(1937);
      e.exports = function (e, t) {
        for (var n = e.length; n--; ) if (a(e[n][0], t)) return n;
        return -1;
      };
    },
    1789: function (e, t, n) {
      var a = n(1782).Symbol;
      e.exports = a;
    },
    1790: function (e, t, n) {
      var a = n(1784)(Object, 'create');
      e.exports = a;
    },
    1791: function (e, t, n) {
      var a = n(1979);
      e.exports = function (e, t) {
        var n = e.__data__;
        return a(t) ? n['string' == typeof t ? 'string' : 'hash'] : n.map;
      };
    },
    1792: function (e, t, n) {
      var a = n(1800);
      e.exports = function (e) {
        if ('string' == typeof e || a(e)) return e;
        var t = e + '';
        return '0' == t && 1 / e == -1 / 0 ? '-0' : t;
      };
    },
    1793: function (e, t, n) {
      var a = n(1954),
        r = n(1786);
      e.exports = function e(t, n, i, s, o) {
        return t === n || (null == t || null == n || (!r(t) && !r(n)) ? t != t && n != n : a(t, n, i, s, e, o));
      };
    },
    1794: function (e, t, n) {
      var a = n(1784)(n(1782), 'Map');
      e.exports = a;
    },
    1795: function (e, t) {
      e.exports = function (e) {
        var t = typeof e;
        return null != e && ('object' == t || 'function' == t);
      };
    },
    1796: function (e, t, n) {
      var a = n(1971),
        r = n(1978),
        i = n(1980),
        s = n(1981),
        o = n(1982);
      function d(e) {
        var t = -1,
          n = null == e ? 0 : e.length;
        for (this.clear(); ++t < n; ) {
          var a = e[t];
          this.set(a[0], a[1]);
        }
      }
      (d.prototype.clear = a),
        (d.prototype.delete = r),
        (d.prototype.get = i),
        (d.prototype.has = s),
        (d.prototype.set = o),
        (e.exports = d);
    },
    1797: function (e, t, n) {
      var a = n(1999),
        r = n(2006),
        i = n(1946);
      e.exports = function (e) {
        return i(e) ? a(e) : r(e);
      };
    },
    1798: function (e, t) {
      e.exports = function (e) {
        return 'number' == typeof e && e > -1 && e % 1 == 0 && e <= 9007199254740991;
      };
    },
    1799: function (e, t, n) {
      var a = n(1783),
        r = n(1800),
        i = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        s = /^\w*$/;
      e.exports = function (e, t) {
        if (a(e)) return !1;
        var n = typeof e;
        return (
          !('number' != n && 'symbol' != n && 'boolean' != n && null != e && !r(e)) ||
          s.test(e) ||
          !i.test(e) ||
          (null != t && e in Object(t))
        );
      };
    },
    1800: function (e, t, n) {
      var a = n(1785),
        r = n(1786);
      e.exports = function (e) {
        return 'symbol' == typeof e || (r(e) && '[object Symbol]' == a(e));
      };
    },
    1801: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('af', {
          months: 'Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember'.split(
            '_',
          ),
          monthsShort: 'Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
          weekdays: 'Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag'.split('_'),
          weekdaysShort: 'Son_Maa_Din_Woe_Don_Vry_Sat'.split('_'),
          weekdaysMin: 'So_Ma_Di_Wo_Do_Vr_Sa'.split('_'),
          meridiemParse: /vm|nm/i,
          isPM: function (e) {
            return /^nm$/i.test(e);
          },
          meridiem: function (e, t, n) {
            return e < 12 ? (n ? 'vm' : 'VM') : n ? 'nm' : 'NM';
          },
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Vandag om] LT',
            nextDay: '[Môre om] LT',
            nextWeek: 'dddd [om] LT',
            lastDay: '[Gister om] LT',
            lastWeek: '[Laas] dddd [om] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'oor %s',
            past: '%s gelede',
            s: "'n paar sekondes",
            ss: '%d sekondes',
            m: "'n minuut",
            mm: '%d minute',
            h: "'n uur",
            hh: '%d ure',
            d: "'n dag",
            dd: '%d dae',
            M: "'n maand",
            MM: '%d maande',
            y: "'n jaar",
            yy: '%d jaar',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
          ordinal: function (e) {
            return e + (1 === e || 8 === e || e >= 20 ? 'ste' : 'de');
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1802: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '١', 2: '٢', 3: '٣', 4: '٤', 5: '٥', 6: '٦', 7: '٧', 8: '٨', 9: '٩', 0: '٠' },
          n = { '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9', '٠': '0' },
          a = function (e) {
            return 0 === e ? 0 : 1 === e ? 1 : 2 === e ? 2 : e % 100 >= 3 && e % 100 <= 10 ? 3 : e % 100 >= 11 ? 4 : 5;
          },
          r = {
            s: ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
            m: ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
            h: ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
            d: ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
            M: ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
            y: ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام'],
          },
          i = function (e) {
            return function (t, n, i, s) {
              var o = a(t),
                d = r[e][a(t)];
              return 2 === o && (d = d[n ? 0 : 1]), d.replace(/%d/i, t);
            };
          },
          s = [
            'يناير',
            'فبراير',
            'مارس',
            'أبريل',
            'مايو',
            'يونيو',
            'يوليو',
            'أغسطس',
            'سبتمبر',
            'أكتوبر',
            'نوفمبر',
            'ديسمبر',
          ];
        e.defineLocale('ar', {
          months: s,
          monthsShort: s,
          weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
          weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
          weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'D/‏M/‏YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          meridiemParse: /ص|م/,
          isPM: function (e) {
            return 'م' === e;
          },
          meridiem: function (e, t, n) {
            return e < 12 ? 'ص' : 'م';
          },
          calendar: {
            sameDay: '[اليوم عند الساعة] LT',
            nextDay: '[غدًا عند الساعة] LT',
            nextWeek: 'dddd [عند الساعة] LT',
            lastDay: '[أمس عند الساعة] LT',
            lastWeek: 'dddd [عند الساعة] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'بعد %s',
            past: 'منذ %s',
            s: i('s'),
            ss: i('s'),
            m: i('m'),
            mm: i('m'),
            h: i('h'),
            hh: i('h'),
            d: i('d'),
            dd: i('d'),
            M: i('M'),
            MM: i('M'),
            y: i('y'),
            yy: i('y'),
          },
          preparse: function (e) {
            return e
              .replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (e) {
                return n[e];
              })
              .replace(/،/g, ',');
          },
          postformat: function (e) {
            return e
              .replace(/\d/g, function (e) {
                return t[e];
              })
              .replace(/,/g, '،');
          },
          week: { dow: 6, doy: 12 },
        });
      })(n(1781));
    },
    1803: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = function (e) {
            return 0 === e ? 0 : 1 === e ? 1 : 2 === e ? 2 : e % 100 >= 3 && e % 100 <= 10 ? 3 : e % 100 >= 11 ? 4 : 5;
          },
          n = {
            s: ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
            m: ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
            h: ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
            d: ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
            M: ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
            y: ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام'],
          },
          a = function (e) {
            return function (a, r, i, s) {
              var o = t(a),
                d = n[e][t(a)];
              return 2 === o && (d = d[r ? 0 : 1]), d.replace(/%d/i, a);
            };
          },
          r = [
            'جانفي',
            'فيفري',
            'مارس',
            'أفريل',
            'ماي',
            'جوان',
            'جويلية',
            'أوت',
            'سبتمبر',
            'أكتوبر',
            'نوفمبر',
            'ديسمبر',
          ];
        e.defineLocale('ar-dz', {
          months: r,
          monthsShort: r,
          weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
          weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
          weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'D/‏M/‏YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          meridiemParse: /ص|م/,
          isPM: function (e) {
            return 'م' === e;
          },
          meridiem: function (e, t, n) {
            return e < 12 ? 'ص' : 'م';
          },
          calendar: {
            sameDay: '[اليوم عند الساعة] LT',
            nextDay: '[غدًا عند الساعة] LT',
            nextWeek: 'dddd [عند الساعة] LT',
            lastDay: '[أمس عند الساعة] LT',
            lastWeek: 'dddd [عند الساعة] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'بعد %s',
            past: 'منذ %s',
            s: a('s'),
            ss: a('s'),
            m: a('m'),
            mm: a('m'),
            h: a('h'),
            hh: a('h'),
            d: a('d'),
            dd: a('d'),
            M: a('M'),
            MM: a('M'),
            y: a('y'),
            yy: a('y'),
          },
          postformat: function (e) {
            return e.replace(/,/g, '،');
          },
          week: { dow: 0, doy: 4 },
        });
      })(n(1781));
    },
    1804: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('ar-kw', {
          months: 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
          monthsShort: 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
          weekdays: 'الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
          weekdaysShort: 'احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
          weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[اليوم على الساعة] LT',
            nextDay: '[غدا على الساعة] LT',
            nextWeek: 'dddd [على الساعة] LT',
            lastDay: '[أمس على الساعة] LT',
            lastWeek: 'dddd [على الساعة] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'في %s',
            past: 'منذ %s',
            s: 'ثوان',
            ss: '%d ثانية',
            m: 'دقيقة',
            mm: '%d دقائق',
            h: 'ساعة',
            hh: '%d ساعات',
            d: 'يوم',
            dd: '%d أيام',
            M: 'شهر',
            MM: '%d أشهر',
            y: 'سنة',
            yy: '%d سنوات',
          },
          week: { dow: 0, doy: 12 },
        });
      })(n(1781));
    },
    1805: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 0: '0' },
          n = function (e) {
            return 0 === e ? 0 : 1 === e ? 1 : 2 === e ? 2 : e % 100 >= 3 && e % 100 <= 10 ? 3 : e % 100 >= 11 ? 4 : 5;
          },
          a = {
            s: ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
            m: ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
            h: ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
            d: ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
            M: ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
            y: ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام'],
          },
          r = function (e) {
            return function (t, r, i, s) {
              var o = n(t),
                d = a[e][n(t)];
              return 2 === o && (d = d[r ? 0 : 1]), d.replace(/%d/i, t);
            };
          },
          i = [
            'يناير',
            'فبراير',
            'مارس',
            'أبريل',
            'مايو',
            'يونيو',
            'يوليو',
            'أغسطس',
            'سبتمبر',
            'أكتوبر',
            'نوفمبر',
            'ديسمبر',
          ];
        e.defineLocale('ar-ly', {
          months: i,
          monthsShort: i,
          weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
          weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
          weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'D/‏M/‏YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          meridiemParse: /ص|م/,
          isPM: function (e) {
            return 'م' === e;
          },
          meridiem: function (e, t, n) {
            return e < 12 ? 'ص' : 'م';
          },
          calendar: {
            sameDay: '[اليوم عند الساعة] LT',
            nextDay: '[غدًا عند الساعة] LT',
            nextWeek: 'dddd [عند الساعة] LT',
            lastDay: '[أمس عند الساعة] LT',
            lastWeek: 'dddd [عند الساعة] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'بعد %s',
            past: 'منذ %s',
            s: r('s'),
            ss: r('s'),
            m: r('m'),
            mm: r('m'),
            h: r('h'),
            hh: r('h'),
            d: r('d'),
            dd: r('d'),
            M: r('M'),
            MM: r('M'),
            y: r('y'),
            yy: r('y'),
          },
          preparse: function (e) {
            return e.replace(/،/g, ',');
          },
          postformat: function (e) {
            return e
              .replace(/\d/g, function (e) {
                return t[e];
              })
              .replace(/,/g, '،');
          },
          week: { dow: 6, doy: 12 },
        });
      })(n(1781));
    },
    1806: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('ar-ma', {
          months: 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
          monthsShort: 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
          weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
          weekdaysShort: 'احد_اثنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
          weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[اليوم على الساعة] LT',
            nextDay: '[غدا على الساعة] LT',
            nextWeek: 'dddd [على الساعة] LT',
            lastDay: '[أمس على الساعة] LT',
            lastWeek: 'dddd [على الساعة] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'في %s',
            past: 'منذ %s',
            s: 'ثوان',
            ss: '%d ثانية',
            m: 'دقيقة',
            mm: '%d دقائق',
            h: 'ساعة',
            hh: '%d ساعات',
            d: 'يوم',
            dd: '%d أيام',
            M: 'شهر',
            MM: '%d أشهر',
            y: 'سنة',
            yy: '%d سنوات',
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1807: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '١', 2: '٢', 3: '٣', 4: '٤', 5: '٥', 6: '٦', 7: '٧', 8: '٨', 9: '٩', 0: '٠' },
          n = { '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9', '٠': '0' };
        e.defineLocale('ar-sa', {
          months: 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
          monthsShort: 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
          weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
          weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
          weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          meridiemParse: /ص|م/,
          isPM: function (e) {
            return 'م' === e;
          },
          meridiem: function (e, t, n) {
            return e < 12 ? 'ص' : 'م';
          },
          calendar: {
            sameDay: '[اليوم على الساعة] LT',
            nextDay: '[غدا على الساعة] LT',
            nextWeek: 'dddd [على الساعة] LT',
            lastDay: '[أمس على الساعة] LT',
            lastWeek: 'dddd [على الساعة] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'في %s',
            past: 'منذ %s',
            s: 'ثوان',
            ss: '%d ثانية',
            m: 'دقيقة',
            mm: '%d دقائق',
            h: 'ساعة',
            hh: '%d ساعات',
            d: 'يوم',
            dd: '%d أيام',
            M: 'شهر',
            MM: '%d أشهر',
            y: 'سنة',
            yy: '%d سنوات',
          },
          preparse: function (e) {
            return e
              .replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (e) {
                return n[e];
              })
              .replace(/،/g, ',');
          },
          postformat: function (e) {
            return e
              .replace(/\d/g, function (e) {
                return t[e];
              })
              .replace(/,/g, '،');
          },
          week: { dow: 0, doy: 6 },
        });
      })(n(1781));
    },
    1808: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('ar-tn', {
          months: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
          monthsShort: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
          weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
          weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
          weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[اليوم على الساعة] LT',
            nextDay: '[غدا على الساعة] LT',
            nextWeek: 'dddd [على الساعة] LT',
            lastDay: '[أمس على الساعة] LT',
            lastWeek: 'dddd [على الساعة] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'في %s',
            past: 'منذ %s',
            s: 'ثوان',
            ss: '%d ثانية',
            m: 'دقيقة',
            mm: '%d دقائق',
            h: 'ساعة',
            hh: '%d ساعات',
            d: 'يوم',
            dd: '%d أيام',
            M: 'شهر',
            MM: '%d أشهر',
            y: 'سنة',
            yy: '%d سنوات',
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1809: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = {
          1: '-inci',
          5: '-inci',
          8: '-inci',
          70: '-inci',
          80: '-inci',
          2: '-nci',
          7: '-nci',
          20: '-nci',
          50: '-nci',
          3: '-üncü',
          4: '-üncü',
          100: '-üncü',
          6: '-ncı',
          9: '-uncu',
          10: '-uncu',
          30: '-uncu',
          60: '-ıncı',
          90: '-ıncı',
        };
        e.defineLocale('az', {
          months: 'yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr'.split('_'),
          monthsShort: 'yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek'.split('_'),
          weekdays: 'Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə'.split('_'),
          weekdaysShort: 'Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən'.split('_'),
          weekdaysMin: 'Bz_BE_ÇA_Çə_CA_Cü_Şə'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[bugün saat] LT',
            nextDay: '[sabah saat] LT',
            nextWeek: '[gələn həftə] dddd [saat] LT',
            lastDay: '[dünən] LT',
            lastWeek: '[keçən həftə] dddd [saat] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s sonra',
            past: '%s əvvəl',
            s: 'bir neçə saniyə',
            ss: '%d saniyə',
            m: 'bir dəqiqə',
            mm: '%d dəqiqə',
            h: 'bir saat',
            hh: '%d saat',
            d: 'bir gün',
            dd: '%d gün',
            M: 'bir ay',
            MM: '%d ay',
            y: 'bir il',
            yy: '%d il',
          },
          meridiemParse: /gecə|səhər|gündüz|axşam/,
          isPM: function (e) {
            return /^(gündüz|axşam)$/.test(e);
          },
          meridiem: function (e, t, n) {
            return e < 4 ? 'gecə' : e < 12 ? 'səhər' : e < 17 ? 'gündüz' : 'axşam';
          },
          dayOfMonthOrdinalParse: /\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,
          ordinal: function (e) {
            if (0 === e) return e + '-ıncı';
            var n = e % 10;
            return e + (t[n] || t[(e % 100) - n] || t[e >= 100 ? 100 : null]);
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1810: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n) {
          var a, r;
          return 'm' === n
            ? t
              ? 'хвіліна'
              : 'хвіліну'
            : 'h' === n
            ? t
              ? 'гадзіна'
              : 'гадзіну'
            : e +
              ' ' +
              ((a = +e),
              (r = {
                ss: t ? 'секунда_секунды_секунд' : 'секунду_секунды_секунд',
                mm: t ? 'хвіліна_хвіліны_хвілін' : 'хвіліну_хвіліны_хвілін',
                hh: t ? 'гадзіна_гадзіны_гадзін' : 'гадзіну_гадзіны_гадзін',
                dd: 'дзень_дні_дзён',
                MM: 'месяц_месяцы_месяцаў',
                yy: 'год_гады_гадоў',
              }[n].split('_')),
              a % 10 == 1 && a % 100 != 11
                ? r[0]
                : a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 10 || a % 100 >= 20)
                ? r[1]
                : r[2]);
        }
        e.defineLocale('be', {
          months: {
            format:
              'студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня'.split(
                '_',
              ),
            standalone:
              'студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань'.split(
                '_',
              ),
          },
          monthsShort: 'студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж'.split('_'),
          weekdays: {
            format: 'нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу'.split('_'),
            standalone: 'нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота'.split('_'),
            isFormat: /\[ ?[Ууў] ?(?:мінулую|наступную)? ?\] ?dddd/,
          },
          weekdaysShort: 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
          weekdaysMin: 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY г.',
            LLL: 'D MMMM YYYY г., HH:mm',
            LLLL: 'dddd, D MMMM YYYY г., HH:mm',
          },
          calendar: {
            sameDay: '[Сёння ў] LT',
            nextDay: '[Заўтра ў] LT',
            lastDay: '[Учора ў] LT',
            nextWeek: function () {
              return '[У] dddd [ў] LT';
            },
            lastWeek: function () {
              switch (this.day()) {
                case 0:
                case 3:
                case 5:
                case 6:
                  return '[У мінулую] dddd [ў] LT';
                case 1:
                case 2:
                case 4:
                  return '[У мінулы] dddd [ў] LT';
              }
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'праз %s',
            past: '%s таму',
            s: 'некалькі секунд',
            m: t,
            mm: t,
            h: t,
            hh: t,
            d: 'дзень',
            dd: t,
            M: 'месяц',
            MM: t,
            y: 'год',
            yy: t,
          },
          meridiemParse: /ночы|раніцы|дня|вечара/,
          isPM: function (e) {
            return /^(дня|вечара)$/.test(e);
          },
          meridiem: function (e, t, n) {
            return e < 4 ? 'ночы' : e < 12 ? 'раніцы' : e < 17 ? 'дня' : 'вечара';
          },
          dayOfMonthOrdinalParse: /\d{1,2}-(і|ы|га)/,
          ordinal: function (e, t) {
            switch (t) {
              case 'M':
              case 'd':
              case 'DDD':
              case 'w':
              case 'W':
                return (e % 10 != 2 && e % 10 != 3) || e % 100 == 12 || e % 100 == 13 ? e + '-ы' : e + '-і';
              case 'D':
                return e + '-га';
              default:
                return e;
            }
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1811: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('bg', {
          months: 'януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември'.split('_'),
          monthsShort: 'яну_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек'.split('_'),
          weekdays: 'неделя_понеделник_вторник_сряда_четвъртък_петък_събота'.split('_'),
          weekdaysShort: 'нед_пон_вто_сря_чет_пет_съб'.split('_'),
          weekdaysMin: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'D.MM.YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY H:mm',
            LLLL: 'dddd, D MMMM YYYY H:mm',
          },
          calendar: {
            sameDay: '[Днес в] LT',
            nextDay: '[Утре в] LT',
            nextWeek: 'dddd [в] LT',
            lastDay: '[Вчера в] LT',
            lastWeek: function () {
              switch (this.day()) {
                case 0:
                case 3:
                case 6:
                  return '[Миналата] dddd [в] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                  return '[Миналия] dddd [в] LT';
              }
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'след %s',
            past: 'преди %s',
            s: 'няколко секунди',
            ss: '%d секунди',
            m: 'минута',
            mm: '%d минути',
            h: 'час',
            hh: '%d часа',
            d: 'ден',
            dd: '%d дена',
            w: 'седмица',
            ww: '%d седмици',
            M: 'месец',
            MM: '%d месеца',
            y: 'година',
            yy: '%d години',
          },
          dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
          ordinal: function (e) {
            var t = e % 10,
              n = e % 100;
            return 0 === e
              ? e + '-ев'
              : 0 === n
              ? e + '-ен'
              : n > 10 && n < 20
              ? e + '-ти'
              : 1 === t
              ? e + '-ви'
              : 2 === t
              ? e + '-ри'
              : 7 === t || 8 === t
              ? e + '-ми'
              : e + '-ти';
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1812: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('bm', {
          months:
            'Zanwuyekalo_Fewuruyekalo_Marisikalo_Awirilikalo_Mɛkalo_Zuwɛnkalo_Zuluyekalo_Utikalo_Sɛtanburukalo_ɔkutɔburukalo_Nowanburukalo_Desanburukalo'.split(
              '_',
            ),
          monthsShort: 'Zan_Few_Mar_Awi_Mɛ_Zuw_Zul_Uti_Sɛt_ɔku_Now_Des'.split('_'),
          weekdays: 'Kari_Ntɛnɛn_Tarata_Araba_Alamisa_Juma_Sibiri'.split('_'),
          weekdaysShort: 'Kar_Ntɛ_Tar_Ara_Ala_Jum_Sib'.split('_'),
          weekdaysMin: 'Ka_Nt_Ta_Ar_Al_Ju_Si'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'MMMM [tile] D [san] YYYY',
            LLL: 'MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm',
            LLLL: 'dddd MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm',
          },
          calendar: {
            sameDay: '[Bi lɛrɛ] LT',
            nextDay: '[Sini lɛrɛ] LT',
            nextWeek: 'dddd [don lɛrɛ] LT',
            lastDay: '[Kunu lɛrɛ] LT',
            lastWeek: 'dddd [tɛmɛnen lɛrɛ] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s kɔnɔ',
            past: 'a bɛ %s bɔ',
            s: 'sanga dama dama',
            ss: 'sekondi %d',
            m: 'miniti kelen',
            mm: 'miniti %d',
            h: 'lɛrɛ kelen',
            hh: 'lɛrɛ %d',
            d: 'tile kelen',
            dd: 'tile %d',
            M: 'kalo kelen',
            MM: 'kalo %d',
            y: 'san kelen',
            yy: 'san %d',
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1813: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '১', 2: '২', 3: '৩', 4: '৪', 5: '৫', 6: '৬', 7: '৭', 8: '৮', 9: '৯', 0: '০' },
          n = { '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9', '০': '0' };
        e.defineLocale('bn', {
          months: 'জানুয়ারি_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর'.split('_'),
          monthsShort: 'জানু_ফেব্রু_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্ট_অক্টো_নভে_ডিসে'.split('_'),
          weekdays: 'রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার'.split('_'),
          weekdaysShort: 'রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি'.split('_'),
          weekdaysMin: 'রবি_সোম_মঙ্গল_বুধ_বৃহ_শুক্র_শনি'.split('_'),
          longDateFormat: {
            LT: 'A h:mm সময়',
            LTS: 'A h:mm:ss সময়',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY, A h:mm সময়',
            LLLL: 'dddd, D MMMM YYYY, A h:mm সময়',
          },
          calendar: {
            sameDay: '[আজ] LT',
            nextDay: '[আগামীকাল] LT',
            nextWeek: 'dddd, LT',
            lastDay: '[গতকাল] LT',
            lastWeek: '[গত] dddd, LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s পরে',
            past: '%s আগে',
            s: 'কয়েক সেকেন্ড',
            ss: '%d সেকেন্ড',
            m: 'এক মিনিট',
            mm: '%d মিনিট',
            h: 'এক ঘন্টা',
            hh: '%d ঘন্টা',
            d: 'এক দিন',
            dd: '%d দিন',
            M: 'এক মাস',
            MM: '%d মাস',
            y: 'এক বছর',
            yy: '%d বছর',
          },
          preparse: function (e) {
            return e.replace(/[১২৩৪৫৬৭৮৯০]/g, function (e) {
              return n[e];
            });
          },
          postformat: function (e) {
            return e.replace(/\d/g, function (e) {
              return t[e];
            });
          },
          meridiemParse: /রাত|সকাল|দুপুর|বিকাল|রাত/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0), ('রাত' === t && e >= 4) || ('দুপুর' === t && e < 5) || 'বিকাল' === t ? e + 12 : e
            );
          },
          meridiem: function (e, t, n) {
            return e < 4 ? 'রাত' : e < 10 ? 'সকাল' : e < 17 ? 'দুপুর' : e < 20 ? 'বিকাল' : 'রাত';
          },
          week: { dow: 0, doy: 6 },
        });
      })(n(1781));
    },
    1814: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '১', 2: '২', 3: '৩', 4: '৪', 5: '৫', 6: '৬', 7: '৭', 8: '৮', 9: '৯', 0: '০' },
          n = { '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9', '০': '0' };
        e.defineLocale('bn-bd', {
          months: 'জানুয়ারি_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর'.split('_'),
          monthsShort: 'জানু_ফেব্রু_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্ট_অক্টো_নভে_ডিসে'.split('_'),
          weekdays: 'রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার'.split('_'),
          weekdaysShort: 'রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি'.split('_'),
          weekdaysMin: 'রবি_সোম_মঙ্গল_বুধ_বৃহ_শুক্র_শনি'.split('_'),
          longDateFormat: {
            LT: 'A h:mm সময়',
            LTS: 'A h:mm:ss সময়',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY, A h:mm সময়',
            LLLL: 'dddd, D MMMM YYYY, A h:mm সময়',
          },
          calendar: {
            sameDay: '[আজ] LT',
            nextDay: '[আগামীকাল] LT',
            nextWeek: 'dddd, LT',
            lastDay: '[গতকাল] LT',
            lastWeek: '[গত] dddd, LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s পরে',
            past: '%s আগে',
            s: 'কয়েক সেকেন্ড',
            ss: '%d সেকেন্ড',
            m: 'এক মিনিট',
            mm: '%d মিনিট',
            h: 'এক ঘন্টা',
            hh: '%d ঘন্টা',
            d: 'এক দিন',
            dd: '%d দিন',
            M: 'এক মাস',
            MM: '%d মাস',
            y: 'এক বছর',
            yy: '%d বছর',
          },
          preparse: function (e) {
            return e.replace(/[১২৩৪৫৬৭৮৯০]/g, function (e) {
              return n[e];
            });
          },
          postformat: function (e) {
            return e.replace(/\d/g, function (e) {
              return t[e];
            });
          },
          meridiemParse: /রাত|ভোর|সকাল|দুপুর|বিকাল|সন্ধ্যা|রাত/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'রাত' === t
                ? e < 4
                  ? e
                  : e + 12
                : 'ভোর' === t || 'সকাল' === t
                ? e
                : 'দুপুর' === t
                ? e >= 3
                  ? e
                  : e + 12
                : 'বিকাল' === t || 'সন্ধ্যা' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            return e < 4
              ? 'রাত'
              : e < 6
              ? 'ভোর'
              : e < 12
              ? 'সকাল'
              : e < 15
              ? 'দুপুর'
              : e < 18
              ? 'বিকাল'
              : e < 20
              ? 'সন্ধ্যা'
              : 'রাত';
          },
          week: { dow: 0, doy: 6 },
        });
      })(n(1781));
    },
    1815: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '༡', 2: '༢', 3: '༣', 4: '༤', 5: '༥', 6: '༦', 7: '༧', 8: '༨', 9: '༩', 0: '༠' },
          n = { '༡': '1', '༢': '2', '༣': '3', '༤': '4', '༥': '5', '༦': '6', '༧': '7', '༨': '8', '༩': '9', '༠': '0' };
        e.defineLocale('bo', {
          months:
            'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split(
              '_',
            ),
          monthsShort: 'ཟླ་1_ཟླ་2_ཟླ་3_ཟླ་4_ཟླ་5_ཟླ་6_ཟླ་7_ཟླ་8_ཟླ་9_ཟླ་10_ཟླ་11_ཟླ་12'.split('_'),
          monthsShortRegex: /^(ཟླ་\d{1,2})/,
          monthsParseExact: !0,
          weekdays: 'གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་'.split('_'),
          weekdaysShort: 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
          weekdaysMin: 'ཉི_ཟླ_མིག_ལྷག_ཕུར_སངས_སྤེན'.split('_'),
          longDateFormat: {
            LT: 'A h:mm',
            LTS: 'A h:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY, A h:mm',
            LLLL: 'dddd, D MMMM YYYY, A h:mm',
          },
          calendar: {
            sameDay: '[དི་རིང] LT',
            nextDay: '[སང་ཉིན] LT',
            nextWeek: '[བདུན་ཕྲག་རྗེས་མ], LT',
            lastDay: '[ཁ་སང] LT',
            lastWeek: '[བདུན་ཕྲག་མཐའ་མ] dddd, LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s ལ་',
            past: '%s སྔན་ལ',
            s: 'ལམ་སང',
            ss: '%d སྐར་ཆ།',
            m: 'སྐར་མ་གཅིག',
            mm: '%d སྐར་མ',
            h: 'ཆུ་ཚོད་གཅིག',
            hh: '%d ཆུ་ཚོད',
            d: 'ཉིན་གཅིག',
            dd: '%d ཉིན་',
            M: 'ཟླ་བ་གཅིག',
            MM: '%d ཟླ་བ',
            y: 'ལོ་གཅིག',
            yy: '%d ལོ',
          },
          preparse: function (e) {
            return e.replace(/[༡༢༣༤༥༦༧༨༩༠]/g, function (e) {
              return n[e];
            });
          },
          postformat: function (e) {
            return e.replace(/\d/g, function (e) {
              return t[e];
            });
          },
          meridiemParse: /མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              ('མཚན་མོ' === t && e >= 4) || ('ཉིན་གུང' === t && e < 5) || 'དགོང་དག' === t ? e + 12 : e
            );
          },
          meridiem: function (e, t, n) {
            return e < 4 ? 'མཚན་མོ' : e < 10 ? 'ཞོགས་ཀས' : e < 17 ? 'ཉིན་གུང' : e < 20 ? 'དགོང་དག' : 'མཚན་མོ';
          },
          week: { dow: 0, doy: 6 },
        });
      })(n(1781));
    },
    1816: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n) {
          return (
            e +
            ' ' +
            (function (e, t) {
              return 2 === t
                ? (function (e) {
                    var t = { m: 'v', b: 'v', d: 'z' };
                    return void 0 === t[e.charAt(0)] ? e : t[e.charAt(0)] + e.substring(1);
                  })(e)
                : e;
            })({ mm: 'munutenn', MM: 'miz', dd: 'devezh' }[n], e)
          );
        }
        var n = [
            /^gen/i,
            /^c[ʼ\']hwe/i,
            /^meu/i,
            /^ebr/i,
            /^mae/i,
            /^(mez|eve)/i,
            /^gou/i,
            /^eos/i,
            /^gwe/i,
            /^her/i,
            /^du/i,
            /^ker/i,
          ],
          a =
            /^(genver|c[ʼ\']hwevrer|meurzh|ebrel|mae|mezheven|gouere|eost|gwengolo|here|du|kerzu|gen|c[ʼ\']hwe|meu|ebr|mae|eve|gou|eos|gwe|her|du|ker)/i,
          r = [/^Su/i, /^Lu/i, /^Me([^r]|$)/i, /^Mer/i, /^Ya/i, /^Gw/i, /^Sa/i];
        e.defineLocale('br', {
          months: 'Genver_Cʼhwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu'.split('_'),
          monthsShort: 'Gen_Cʼhwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker'.split('_'),
          weekdays: 'Sul_Lun_Meurzh_Mercʼher_Yaou_Gwener_Sadorn'.split('_'),
          weekdaysShort: 'Sul_Lun_Meu_Mer_Yao_Gwe_Sad'.split('_'),
          weekdaysMin: 'Su_Lu_Me_Mer_Ya_Gw_Sa'.split('_'),
          weekdaysParse: r,
          fullWeekdaysParse: [/^sul/i, /^lun/i, /^meurzh/i, /^merc[ʼ\']her/i, /^yaou/i, /^gwener/i, /^sadorn/i],
          shortWeekdaysParse: [/^Sul/i, /^Lun/i, /^Meu/i, /^Mer/i, /^Yao/i, /^Gwe/i, /^Sad/i],
          minWeekdaysParse: r,
          monthsRegex: a,
          monthsShortRegex: a,
          monthsStrictRegex: /^(genver|c[ʼ\']hwevrer|meurzh|ebrel|mae|mezheven|gouere|eost|gwengolo|here|du|kerzu)/i,
          monthsShortStrictRegex: /^(gen|c[ʼ\']hwe|meu|ebr|mae|eve|gou|eos|gwe|her|du|ker)/i,
          monthsParse: n,
          longMonthsParse: n,
          shortMonthsParse: n,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D [a viz] MMMM YYYY',
            LLL: 'D [a viz] MMMM YYYY HH:mm',
            LLLL: 'dddd, D [a viz] MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Hiziv da] LT',
            nextDay: '[Warcʼhoazh da] LT',
            nextWeek: 'dddd [da] LT',
            lastDay: '[Decʼh da] LT',
            lastWeek: 'dddd [paset da] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'a-benn %s',
            past: '%s ʼzo',
            s: 'un nebeud segondennoù',
            ss: '%d eilenn',
            m: 'ur vunutenn',
            mm: t,
            h: 'un eur',
            hh: '%d eur',
            d: 'un devezh',
            dd: t,
            M: 'ur miz',
            MM: t,
            y: 'ur bloaz',
            yy: function (e) {
              switch (
                (function e(t) {
                  return t > 9 ? e(t % 10) : t;
                })(e)
              ) {
                case 1:
                case 3:
                case 4:
                case 5:
                case 9:
                  return e + ' bloaz';
                default:
                  return e + ' vloaz';
              }
            },
          },
          dayOfMonthOrdinalParse: /\d{1,2}(añ|vet)/,
          ordinal: function (e) {
            return e + (1 === e ? 'añ' : 'vet');
          },
          week: { dow: 1, doy: 4 },
          meridiemParse: /a.m.|g.m./,
          isPM: function (e) {
            return 'g.m.' === e;
          },
          meridiem: function (e, t, n) {
            return e < 12 ? 'a.m.' : 'g.m.';
          },
        });
      })(n(1781));
    },
    1817: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n) {
          var a = e + ' ';
          switch (n) {
            case 'ss':
              return (a += 1 === e ? 'sekunda' : 2 === e || 3 === e || 4 === e ? 'sekunde' : 'sekundi');
            case 'm':
              return t ? 'jedna minuta' : 'jedne minute';
            case 'mm':
              return (a += 1 === e ? 'minuta' : 2 === e || 3 === e || 4 === e ? 'minute' : 'minuta');
            case 'h':
              return t ? 'jedan sat' : 'jednog sata';
            case 'hh':
              return (a += 1 === e ? 'sat' : 2 === e || 3 === e || 4 === e ? 'sata' : 'sati');
            case 'dd':
              return (a += 1 === e ? 'dan' : 'dana');
            case 'MM':
              return (a += 1 === e ? 'mjesec' : 2 === e || 3 === e || 4 === e ? 'mjeseca' : 'mjeseci');
            case 'yy':
              return (a += 1 === e ? 'godina' : 2 === e || 3 === e || 4 === e ? 'godine' : 'godina');
          }
        }
        e.defineLocale('bs', {
          months: 'januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar'.split('_'),
          monthsShort: 'jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
          weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
          weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY H:mm',
            LLLL: 'dddd, D. MMMM YYYY H:mm',
          },
          calendar: {
            sameDay: '[danas u] LT',
            nextDay: '[sutra u] LT',
            nextWeek: function () {
              switch (this.day()) {
                case 0:
                  return '[u] [nedjelju] [u] LT';
                case 3:
                  return '[u] [srijedu] [u] LT';
                case 6:
                  return '[u] [subotu] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                  return '[u] dddd [u] LT';
              }
            },
            lastDay: '[jučer u] LT',
            lastWeek: function () {
              switch (this.day()) {
                case 0:
                case 3:
                  return '[prošlu] dddd [u] LT';
                case 6:
                  return '[prošle] [subote] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                  return '[prošli] dddd [u] LT';
              }
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'za %s',
            past: 'prije %s',
            s: 'par sekundi',
            ss: t,
            m: t,
            mm: t,
            h: t,
            hh: t,
            d: 'dan',
            dd: t,
            M: 'mjesec',
            MM: t,
            y: 'godinu',
            yy: t,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1818: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('ca', {
          months: {
            standalone: 'gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre'.split('_'),
            format:
              "de gener_de febrer_de març_d'abril_de maig_de juny_de juliol_d'agost_de setembre_d'octubre_de novembre_de desembre".split(
                '_',
              ),
            isFormat: /D[oD]?(\s)+MMMM/,
          },
          monthsShort: 'gen._febr._març_abr._maig_juny_jul._ag._set._oct._nov._des.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte'.split('_'),
          weekdaysShort: 'dg._dl._dt._dc._dj._dv._ds.'.split('_'),
          weekdaysMin: 'dg_dl_dt_dc_dj_dv_ds'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM [de] YYYY',
            ll: 'D MMM YYYY',
            LLL: 'D MMMM [de] YYYY [a les] H:mm',
            lll: 'D MMM YYYY, H:mm',
            LLLL: 'dddd D MMMM [de] YYYY [a les] H:mm',
            llll: 'ddd D MMM YYYY, H:mm',
          },
          calendar: {
            sameDay: function () {
              return '[avui a ' + (1 !== this.hours() ? 'les' : 'la') + '] LT';
            },
            nextDay: function () {
              return '[demà a ' + (1 !== this.hours() ? 'les' : 'la') + '] LT';
            },
            nextWeek: function () {
              return 'dddd [a ' + (1 !== this.hours() ? 'les' : 'la') + '] LT';
            },
            lastDay: function () {
              return '[ahir a ' + (1 !== this.hours() ? 'les' : 'la') + '] LT';
            },
            lastWeek: function () {
              return '[el] dddd [passat a ' + (1 !== this.hours() ? 'les' : 'la') + '] LT';
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: "d'aquí %s",
            past: 'fa %s',
            s: 'uns segons',
            ss: '%d segons',
            m: 'un minut',
            mm: '%d minuts',
            h: 'una hora',
            hh: '%d hores',
            d: 'un dia',
            dd: '%d dies',
            M: 'un mes',
            MM: '%d mesos',
            y: 'un any',
            yy: '%d anys',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(r|n|t|è|a)/,
          ordinal: function (e, t) {
            var n = 1 === e ? 'r' : 2 === e ? 'n' : 3 === e ? 'r' : 4 === e ? 't' : 'è';
            return ('w' !== t && 'W' !== t) || (n = 'a'), e + n;
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1819: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = 'leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec'.split('_'),
          n = 'led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro'.split('_'),
          a = [
            /^led/i,
            /^úno/i,
            /^bře/i,
            /^dub/i,
            /^kvě/i,
            /^(čvn|červen$|června)/i,
            /^(čvc|červenec|července)/i,
            /^srp/i,
            /^zář/i,
            /^říj/i,
            /^lis/i,
            /^pro/i,
          ],
          r =
            /^(leden|únor|březen|duben|květen|červenec|července|červen|června|srpen|září|říjen|listopad|prosinec|led|úno|bře|dub|kvě|čvn|čvc|srp|zář|říj|lis|pro)/i;
        function i(e) {
          return e > 1 && e < 5 && 1 != ~~(e / 10);
        }
        function s(e, t, n, a) {
          var r = e + ' ';
          switch (n) {
            case 's':
              return t || a ? 'pár sekund' : 'pár sekundami';
            case 'ss':
              return t || a ? r + (i(e) ? 'sekundy' : 'sekund') : r + 'sekundami';
            case 'm':
              return t ? 'minuta' : a ? 'minutu' : 'minutou';
            case 'mm':
              return t || a ? r + (i(e) ? 'minuty' : 'minut') : r + 'minutami';
            case 'h':
              return t ? 'hodina' : a ? 'hodinu' : 'hodinou';
            case 'hh':
              return t || a ? r + (i(e) ? 'hodiny' : 'hodin') : r + 'hodinami';
            case 'd':
              return t || a ? 'den' : 'dnem';
            case 'dd':
              return t || a ? r + (i(e) ? 'dny' : 'dní') : r + 'dny';
            case 'M':
              return t || a ? 'měsíc' : 'měsícem';
            case 'MM':
              return t || a ? r + (i(e) ? 'měsíce' : 'měsíců') : r + 'měsíci';
            case 'y':
              return t || a ? 'rok' : 'rokem';
            case 'yy':
              return t || a ? r + (i(e) ? 'roky' : 'let') : r + 'lety';
          }
        }
        e.defineLocale('cs', {
          months: t,
          monthsShort: n,
          monthsRegex: r,
          monthsShortRegex: r,
          monthsStrictRegex:
            /^(leden|ledna|února|únor|březen|března|duben|dubna|květen|května|červenec|července|červen|června|srpen|srpna|září|říjen|října|listopadu|listopad|prosinec|prosince)/i,
          monthsShortStrictRegex: /^(led|úno|bře|dub|kvě|čvn|čvc|srp|zář|říj|lis|pro)/i,
          monthsParse: a,
          longMonthsParse: a,
          shortMonthsParse: a,
          weekdays: 'neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota'.split('_'),
          weekdaysShort: 'ne_po_út_st_čt_pá_so'.split('_'),
          weekdaysMin: 'ne_po_út_st_čt_pá_so'.split('_'),
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY H:mm',
            LLLL: 'dddd D. MMMM YYYY H:mm',
            l: 'D. M. YYYY',
          },
          calendar: {
            sameDay: '[dnes v] LT',
            nextDay: '[zítra v] LT',
            nextWeek: function () {
              switch (this.day()) {
                case 0:
                  return '[v neděli v] LT';
                case 1:
                case 2:
                  return '[v] dddd [v] LT';
                case 3:
                  return '[ve středu v] LT';
                case 4:
                  return '[ve čtvrtek v] LT';
                case 5:
                  return '[v pátek v] LT';
                case 6:
                  return '[v sobotu v] LT';
              }
            },
            lastDay: '[včera v] LT',
            lastWeek: function () {
              switch (this.day()) {
                case 0:
                  return '[minulou neděli v] LT';
                case 1:
                case 2:
                  return '[minulé] dddd [v] LT';
                case 3:
                  return '[minulou středu v] LT';
                case 4:
                case 5:
                  return '[minulý] dddd [v] LT';
                case 6:
                  return '[minulou sobotu v] LT';
              }
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'za %s',
            past: 'před %s',
            s: s,
            ss: s,
            m: s,
            mm: s,
            h: s,
            hh: s,
            d: s,
            dd: s,
            M: s,
            MM: s,
            y: s,
            yy: s,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1820: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('cv', {
          months: 'кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав'.split('_'),
          monthsShort: 'кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш'.split('_'),
          weekdays: 'вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун'.split('_'),
          weekdaysShort: 'выр_тун_ытл_юн_кӗҫ_эрн_шӑм'.split('_'),
          weekdaysMin: 'вр_тн_ыт_юн_кҫ_эр_шм'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD-MM-YYYY',
            LL: 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]',
            LLL: 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm',
            LLLL: 'dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm',
          },
          calendar: {
            sameDay: '[Паян] LT [сехетре]',
            nextDay: '[Ыран] LT [сехетре]',
            lastDay: '[Ӗнер] LT [сехетре]',
            nextWeek: '[Ҫитес] dddd LT [сехетре]',
            lastWeek: '[Иртнӗ] dddd LT [сехетре]',
            sameElse: 'L',
          },
          relativeTime: {
            future: function (e) {
              return e + (/сехет$/i.exec(e) ? 'рен' : /ҫул$/i.exec(e) ? 'тан' : 'ран');
            },
            past: '%s каялла',
            s: 'пӗр-ик ҫеккунт',
            ss: '%d ҫеккунт',
            m: 'пӗр минут',
            mm: '%d минут',
            h: 'пӗр сехет',
            hh: '%d сехет',
            d: 'пӗр кун',
            dd: '%d кун',
            M: 'пӗр уйӑх',
            MM: '%d уйӑх',
            y: 'пӗр ҫул',
            yy: '%d ҫул',
          },
          dayOfMonthOrdinalParse: /\d{1,2}-мӗш/,
          ordinal: '%d-мӗш',
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1821: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('cy', {
          months: 'Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr'.split('_'),
          monthsShort: 'Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag'.split('_'),
          weekdays: 'Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn'.split('_'),
          weekdaysShort: 'Sul_Llun_Maw_Mer_Iau_Gwe_Sad'.split('_'),
          weekdaysMin: 'Su_Ll_Ma_Me_Ia_Gw_Sa'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Heddiw am] LT',
            nextDay: '[Yfory am] LT',
            nextWeek: 'dddd [am] LT',
            lastDay: '[Ddoe am] LT',
            lastWeek: 'dddd [diwethaf am] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'mewn %s',
            past: '%s yn ôl',
            s: 'ychydig eiliadau',
            ss: '%d eiliad',
            m: 'munud',
            mm: '%d munud',
            h: 'awr',
            hh: '%d awr',
            d: 'diwrnod',
            dd: '%d diwrnod',
            M: 'mis',
            MM: '%d mis',
            y: 'blwyddyn',
            yy: '%d flynedd',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
          ordinal: function (e) {
            var t = '';
            return (
              e > 20
                ? (t = 40 === e || 50 === e || 60 === e || 80 === e || 100 === e ? 'fed' : 'ain')
                : e > 0 &&
                  (t = [
                    '',
                    'af',
                    'il',
                    'ydd',
                    'ydd',
                    'ed',
                    'ed',
                    'ed',
                    'fed',
                    'fed',
                    'fed',
                    'eg',
                    'fed',
                    'eg',
                    'eg',
                    'fed',
                    'eg',
                    'eg',
                    'fed',
                    'eg',
                    'fed',
                  ][e]),
              e + t
            );
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1822: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('da', {
          months: 'januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december'.split('_'),
          monthsShort: 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
          weekdays: 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
          weekdaysShort: 'søn_man_tir_ons_tor_fre_lør'.split('_'),
          weekdaysMin: 'sø_ma_ti_on_to_fr_lø'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY HH:mm',
            LLLL: 'dddd [d.] D. MMMM YYYY [kl.] HH:mm',
          },
          calendar: {
            sameDay: '[i dag kl.] LT',
            nextDay: '[i morgen kl.] LT',
            nextWeek: 'på dddd [kl.] LT',
            lastDay: '[i går kl.] LT',
            lastWeek: '[i] dddd[s kl.] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'om %s',
            past: '%s siden',
            s: 'få sekunder',
            ss: '%d sekunder',
            m: 'et minut',
            mm: '%d minutter',
            h: 'en time',
            hh: '%d timer',
            d: 'en dag',
            dd: '%d dage',
            M: 'en måned',
            MM: '%d måneder',
            y: 'et år',
            yy: '%d år',
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1823: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n, a) {
          var r = {
            m: ['eine Minute', 'einer Minute'],
            h: ['eine Stunde', 'einer Stunde'],
            d: ['ein Tag', 'einem Tag'],
            dd: [e + ' Tage', e + ' Tagen'],
            w: ['eine Woche', 'einer Woche'],
            M: ['ein Monat', 'einem Monat'],
            MM: [e + ' Monate', e + ' Monaten'],
            y: ['ein Jahr', 'einem Jahr'],
            yy: [e + ' Jahre', e + ' Jahren'],
          };
          return t ? r[n][0] : r[n][1];
        }
        e.defineLocale('de', {
          months: 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
          monthsShort: 'Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
          weekdaysShort: 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
          weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY HH:mm',
            LLLL: 'dddd, D. MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[heute um] LT [Uhr]',
            sameElse: 'L',
            nextDay: '[morgen um] LT [Uhr]',
            nextWeek: 'dddd [um] LT [Uhr]',
            lastDay: '[gestern um] LT [Uhr]',
            lastWeek: '[letzten] dddd [um] LT [Uhr]',
          },
          relativeTime: {
            future: 'in %s',
            past: 'vor %s',
            s: 'ein paar Sekunden',
            ss: '%d Sekunden',
            m: t,
            mm: '%d Minuten',
            h: t,
            hh: '%d Stunden',
            d: t,
            dd: t,
            w: t,
            ww: '%d Wochen',
            M: t,
            MM: t,
            y: t,
            yy: t,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1824: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n, a) {
          var r = {
            m: ['eine Minute', 'einer Minute'],
            h: ['eine Stunde', 'einer Stunde'],
            d: ['ein Tag', 'einem Tag'],
            dd: [e + ' Tage', e + ' Tagen'],
            w: ['eine Woche', 'einer Woche'],
            M: ['ein Monat', 'einem Monat'],
            MM: [e + ' Monate', e + ' Monaten'],
            y: ['ein Jahr', 'einem Jahr'],
            yy: [e + ' Jahre', e + ' Jahren'],
          };
          return t ? r[n][0] : r[n][1];
        }
        e.defineLocale('de-at', {
          months: 'Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
          monthsShort: 'Jän._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
          weekdaysShort: 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
          weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY HH:mm',
            LLLL: 'dddd, D. MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[heute um] LT [Uhr]',
            sameElse: 'L',
            nextDay: '[morgen um] LT [Uhr]',
            nextWeek: 'dddd [um] LT [Uhr]',
            lastDay: '[gestern um] LT [Uhr]',
            lastWeek: '[letzten] dddd [um] LT [Uhr]',
          },
          relativeTime: {
            future: 'in %s',
            past: 'vor %s',
            s: 'ein paar Sekunden',
            ss: '%d Sekunden',
            m: t,
            mm: '%d Minuten',
            h: t,
            hh: '%d Stunden',
            d: t,
            dd: t,
            w: t,
            ww: '%d Wochen',
            M: t,
            MM: t,
            y: t,
            yy: t,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1825: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n, a) {
          var r = {
            m: ['eine Minute', 'einer Minute'],
            h: ['eine Stunde', 'einer Stunde'],
            d: ['ein Tag', 'einem Tag'],
            dd: [e + ' Tage', e + ' Tagen'],
            w: ['eine Woche', 'einer Woche'],
            M: ['ein Monat', 'einem Monat'],
            MM: [e + ' Monate', e + ' Monaten'],
            y: ['ein Jahr', 'einem Jahr'],
            yy: [e + ' Jahre', e + ' Jahren'],
          };
          return t ? r[n][0] : r[n][1];
        }
        e.defineLocale('de-ch', {
          months: 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
          monthsShort: 'Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
          weekdaysShort: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
          weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY HH:mm',
            LLLL: 'dddd, D. MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[heute um] LT [Uhr]',
            sameElse: 'L',
            nextDay: '[morgen um] LT [Uhr]',
            nextWeek: 'dddd [um] LT [Uhr]',
            lastDay: '[gestern um] LT [Uhr]',
            lastWeek: '[letzten] dddd [um] LT [Uhr]',
          },
          relativeTime: {
            future: 'in %s',
            past: 'vor %s',
            s: 'ein paar Sekunden',
            ss: '%d Sekunden',
            m: t,
            mm: '%d Minuten',
            h: t,
            hh: '%d Stunden',
            d: t,
            dd: t,
            w: t,
            ww: '%d Wochen',
            M: t,
            MM: t,
            y: t,
            yy: t,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1826: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = [
            'ޖެނުއަރީ',
            'ފެބްރުއަރީ',
            'މާރިޗު',
            'އޭޕްރީލު',
            'މޭ',
            'ޖޫން',
            'ޖުލައި',
            'އޯގަސްޓު',
            'ސެޕްޓެމްބަރު',
            'އޮކްޓޯބަރު',
            'ނޮވެމްބަރު',
            'ޑިސެމްބަރު',
          ],
          n = ['އާދިއްތަ', 'ހޯމަ', 'އަންގާރަ', 'ބުދަ', 'ބުރާސްފަތި', 'ހުކުރު', 'ހޮނިހިރު'];
        e.defineLocale('dv', {
          months: t,
          monthsShort: t,
          weekdays: n,
          weekdaysShort: n,
          weekdaysMin: 'އާދި_ހޯމަ_އަން_ބުދަ_ބުރާ_ހުކު_ހޮނި'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'D/M/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          meridiemParse: /މކ|މފ/,
          isPM: function (e) {
            return 'މފ' === e;
          },
          meridiem: function (e, t, n) {
            return e < 12 ? 'މކ' : 'މފ';
          },
          calendar: {
            sameDay: '[މިއަދު] LT',
            nextDay: '[މާދަމާ] LT',
            nextWeek: 'dddd LT',
            lastDay: '[އިއްޔެ] LT',
            lastWeek: '[ފާއިތުވި] dddd LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'ތެރޭގައި %s',
            past: 'ކުރިން %s',
            s: 'ސިކުންތުކޮޅެއް',
            ss: 'd% ސިކުންތު',
            m: 'މިނިޓެއް',
            mm: 'މިނިޓު %d',
            h: 'ގަޑިއިރެއް',
            hh: 'ގަޑިއިރު %d',
            d: 'ދުވަހެއް',
            dd: 'ދުވަސް %d',
            M: 'މަހެއް',
            MM: 'މަސް %d',
            y: 'އަހަރެއް',
            yy: 'އަހަރު %d',
          },
          preparse: function (e) {
            return e.replace(/،/g, ',');
          },
          postformat: function (e) {
            return e.replace(/,/g, '،');
          },
          week: { dow: 7, doy: 12 },
        });
      })(n(1781));
    },
    1827: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('el', {
          monthsNominativeEl:
            'Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος'.split(
              '_',
            ),
          monthsGenitiveEl:
            'Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου'.split(
              '_',
            ),
          months: function (e, t) {
            return e
              ? 'string' == typeof t && /D/.test(t.substring(0, t.indexOf('MMMM')))
                ? this._monthsGenitiveEl[e.month()]
                : this._monthsNominativeEl[e.month()]
              : this._monthsNominativeEl;
          },
          monthsShort: 'Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ'.split('_'),
          weekdays: 'Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο'.split('_'),
          weekdaysShort: 'Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ'.split('_'),
          weekdaysMin: 'Κυ_Δε_Τρ_Τε_Πε_Πα_Σα'.split('_'),
          meridiem: function (e, t, n) {
            return e > 11 ? (n ? 'μμ' : 'ΜΜ') : n ? 'πμ' : 'ΠΜ';
          },
          isPM: function (e) {
            return 'μ' === (e + '').toLowerCase()[0];
          },
          meridiemParse: /[ΠΜ]\.?Μ?\.?/i,
          longDateFormat: {
            LT: 'h:mm A',
            LTS: 'h:mm:ss A',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY h:mm A',
            LLLL: 'dddd, D MMMM YYYY h:mm A',
          },
          calendarEl: {
            sameDay: '[Σήμερα {}] LT',
            nextDay: '[Αύριο {}] LT',
            nextWeek: 'dddd [{}] LT',
            lastDay: '[Χθες {}] LT',
            lastWeek: function () {
              switch (this.day()) {
                case 6:
                  return '[το προηγούμενο] dddd [{}] LT';
                default:
                  return '[την προηγούμενη] dddd [{}] LT';
              }
            },
            sameElse: 'L',
          },
          calendar: function (e, t) {
            var n,
              a = this._calendarEl[e],
              r = t && t.hours();
            return (
              (n = a),
              (('undefined' != typeof Function && n instanceof Function) ||
                '[object Function]' === Object.prototype.toString.call(n)) &&
                (a = a.apply(t)),
              a.replace('{}', r % 12 == 1 ? 'στη' : 'στις')
            );
          },
          relativeTime: {
            future: 'σε %s',
            past: '%s πριν',
            s: 'λίγα δευτερόλεπτα',
            ss: '%d δευτερόλεπτα',
            m: 'ένα λεπτό',
            mm: '%d λεπτά',
            h: 'μία ώρα',
            hh: '%d ώρες',
            d: 'μία μέρα',
            dd: '%d μέρες',
            M: 'ένας μήνας',
            MM: '%d μήνες',
            y: 'ένας χρόνος',
            yy: '%d χρόνια',
          },
          dayOfMonthOrdinalParse: /\d{1,2}η/,
          ordinal: '%dη',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1828: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('en-au', {
          months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
          monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
          weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
          weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
          weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
          longDateFormat: {
            LT: 'h:mm A',
            LTS: 'h:mm:ss A',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY h:mm A',
            LLLL: 'dddd, D MMMM YYYY h:mm A',
          },
          calendar: {
            sameDay: '[Today at] LT',
            nextDay: '[Tomorrow at] LT',
            nextWeek: 'dddd [at] LT',
            lastDay: '[Yesterday at] LT',
            lastWeek: '[Last] dddd [at] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: 'a few seconds',
            ss: '%d seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
          ordinal: function (e) {
            var t = e % 10;
            return e + (1 == ~~((e % 100) / 10) ? 'th' : 1 === t ? 'st' : 2 === t ? 'nd' : 3 === t ? 'rd' : 'th');
          },
          week: { dow: 0, doy: 4 },
        });
      })(n(1781));
    },
    1829: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('en-ca', {
          months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
          monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
          weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
          weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
          weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
          longDateFormat: {
            LT: 'h:mm A',
            LTS: 'h:mm:ss A',
            L: 'YYYY-MM-DD',
            LL: 'MMMM D, YYYY',
            LLL: 'MMMM D, YYYY h:mm A',
            LLLL: 'dddd, MMMM D, YYYY h:mm A',
          },
          calendar: {
            sameDay: '[Today at] LT',
            nextDay: '[Tomorrow at] LT',
            nextWeek: 'dddd [at] LT',
            lastDay: '[Yesterday at] LT',
            lastWeek: '[Last] dddd [at] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: 'a few seconds',
            ss: '%d seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
          ordinal: function (e) {
            var t = e % 10;
            return e + (1 == ~~((e % 100) / 10) ? 'th' : 1 === t ? 'st' : 2 === t ? 'nd' : 3 === t ? 'rd' : 'th');
          },
        });
      })(n(1781));
    },
    1830: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('en-gb', {
          months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
          monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
          weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
          weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
          weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Today at] LT',
            nextDay: '[Tomorrow at] LT',
            nextWeek: 'dddd [at] LT',
            lastDay: '[Yesterday at] LT',
            lastWeek: '[Last] dddd [at] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: 'a few seconds',
            ss: '%d seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
          ordinal: function (e) {
            var t = e % 10;
            return e + (1 == ~~((e % 100) / 10) ? 'th' : 1 === t ? 'st' : 2 === t ? 'nd' : 3 === t ? 'rd' : 'th');
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1831: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('en-ie', {
          months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
          monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
          weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
          weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
          weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Today at] LT',
            nextDay: '[Tomorrow at] LT',
            nextWeek: 'dddd [at] LT',
            lastDay: '[Yesterday at] LT',
            lastWeek: '[Last] dddd [at] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: 'a few seconds',
            ss: '%d seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
          ordinal: function (e) {
            var t = e % 10;
            return e + (1 == ~~((e % 100) / 10) ? 'th' : 1 === t ? 'st' : 2 === t ? 'nd' : 3 === t ? 'rd' : 'th');
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1832: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('en-il', {
          months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
          monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
          weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
          weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
          weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Today at] LT',
            nextDay: '[Tomorrow at] LT',
            nextWeek: 'dddd [at] LT',
            lastDay: '[Yesterday at] LT',
            lastWeek: '[Last] dddd [at] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: 'a few seconds',
            ss: '%d seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
          ordinal: function (e) {
            var t = e % 10;
            return e + (1 == ~~((e % 100) / 10) ? 'th' : 1 === t ? 'st' : 2 === t ? 'nd' : 3 === t ? 'rd' : 'th');
          },
        });
      })(n(1781));
    },
    1833: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('en-in', {
          months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
          monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
          weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
          weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
          weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
          longDateFormat: {
            LT: 'h:mm A',
            LTS: 'h:mm:ss A',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY h:mm A',
            LLLL: 'dddd, D MMMM YYYY h:mm A',
          },
          calendar: {
            sameDay: '[Today at] LT',
            nextDay: '[Tomorrow at] LT',
            nextWeek: 'dddd [at] LT',
            lastDay: '[Yesterday at] LT',
            lastWeek: '[Last] dddd [at] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: 'a few seconds',
            ss: '%d seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
          ordinal: function (e) {
            var t = e % 10;
            return e + (1 == ~~((e % 100) / 10) ? 'th' : 1 === t ? 'st' : 2 === t ? 'nd' : 3 === t ? 'rd' : 'th');
          },
          week: { dow: 0, doy: 6 },
        });
      })(n(1781));
    },
    1834: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('en-nz', {
          months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
          monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
          weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
          weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
          weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
          longDateFormat: {
            LT: 'h:mm A',
            LTS: 'h:mm:ss A',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY h:mm A',
            LLLL: 'dddd, D MMMM YYYY h:mm A',
          },
          calendar: {
            sameDay: '[Today at] LT',
            nextDay: '[Tomorrow at] LT',
            nextWeek: 'dddd [at] LT',
            lastDay: '[Yesterday at] LT',
            lastWeek: '[Last] dddd [at] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: 'a few seconds',
            ss: '%d seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
          ordinal: function (e) {
            var t = e % 10;
            return e + (1 == ~~((e % 100) / 10) ? 'th' : 1 === t ? 'st' : 2 === t ? 'nd' : 3 === t ? 'rd' : 'th');
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1835: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('en-sg', {
          months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
          monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
          weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
          weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
          weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Today at] LT',
            nextDay: '[Tomorrow at] LT',
            nextWeek: 'dddd [at] LT',
            lastDay: '[Yesterday at] LT',
            lastWeek: '[Last] dddd [at] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: 'a few seconds',
            ss: '%d seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
          ordinal: function (e) {
            var t = e % 10;
            return e + (1 == ~~((e % 100) / 10) ? 'th' : 1 === t ? 'st' : 2 === t ? 'nd' : 3 === t ? 'rd' : 'th');
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1836: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('eo', {
          months: 'januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro'.split(
            '_',
          ),
          monthsShort: 'jan_feb_mart_apr_maj_jun_jul_aŭg_sept_okt_nov_dec'.split('_'),
          weekdays: 'dimanĉo_lundo_mardo_merkredo_ĵaŭdo_vendredo_sabato'.split('_'),
          weekdaysShort: 'dim_lun_mard_merk_ĵaŭ_ven_sab'.split('_'),
          weekdaysMin: 'di_lu_ma_me_ĵa_ve_sa'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'YYYY-MM-DD',
            LL: '[la] D[-an de] MMMM, YYYY',
            LLL: '[la] D[-an de] MMMM, YYYY HH:mm',
            LLLL: 'dddd[n], [la] D[-an de] MMMM, YYYY HH:mm',
            llll: 'ddd, [la] D[-an de] MMM, YYYY HH:mm',
          },
          meridiemParse: /[ap]\.t\.m/i,
          isPM: function (e) {
            return 'p' === e.charAt(0).toLowerCase();
          },
          meridiem: function (e, t, n) {
            return e > 11 ? (n ? 'p.t.m.' : 'P.T.M.') : n ? 'a.t.m.' : 'A.T.M.';
          },
          calendar: {
            sameDay: '[Hodiaŭ je] LT',
            nextDay: '[Morgaŭ je] LT',
            nextWeek: 'dddd[n je] LT',
            lastDay: '[Hieraŭ je] LT',
            lastWeek: '[pasintan] dddd[n je] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'post %s',
            past: 'antaŭ %s',
            s: 'kelkaj sekundoj',
            ss: '%d sekundoj',
            m: 'unu minuto',
            mm: '%d minutoj',
            h: 'unu horo',
            hh: '%d horoj',
            d: 'unu tago',
            dd: '%d tagoj',
            M: 'unu monato',
            MM: '%d monatoj',
            y: 'unu jaro',
            yy: '%d jaroj',
          },
          dayOfMonthOrdinalParse: /\d{1,2}a/,
          ordinal: '%da',
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1837: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
          n = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
          a = [
            /^ene/i,
            /^feb/i,
            /^mar/i,
            /^abr/i,
            /^may/i,
            /^jun/i,
            /^jul/i,
            /^ago/i,
            /^sep/i,
            /^oct/i,
            /^nov/i,
            /^dic/i,
          ],
          r =
            /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;
        e.defineLocale('es', {
          months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
          monthsShort: function (e, a) {
            return e ? (/-MMM-/.test(a) ? n[e.month()] : t[e.month()]) : t;
          },
          monthsRegex: r,
          monthsShortRegex: r,
          monthsStrictRegex:
            /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
          monthsShortStrictRegex:
            /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
          monthsParse: a,
          longMonthsParse: a,
          shortMonthsParse: a,
          weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
          weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
          weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D [de] MMMM [de] YYYY',
            LLL: 'D [de] MMMM [de] YYYY H:mm',
            LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm',
          },
          calendar: {
            sameDay: function () {
              return '[hoy a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            nextDay: function () {
              return '[mañana a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            nextWeek: function () {
              return 'dddd [a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            lastDay: function () {
              return '[ayer a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            lastWeek: function () {
              return '[el] dddd [pasado a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'en %s',
            past: 'hace %s',
            s: 'unos segundos',
            ss: '%d segundos',
            m: 'un minuto',
            mm: '%d minutos',
            h: 'una hora',
            hh: '%d horas',
            d: 'un día',
            dd: '%d días',
            w: 'una semana',
            ww: '%d semanas',
            M: 'un mes',
            MM: '%d meses',
            y: 'un año',
            yy: '%d años',
          },
          dayOfMonthOrdinalParse: /\d{1,2}º/,
          ordinal: '%dº',
          week: { dow: 1, doy: 4 },
          invalidDate: 'Fecha inválida',
        });
      })(n(1781));
    },
    1838: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
          n = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
          a = [
            /^ene/i,
            /^feb/i,
            /^mar/i,
            /^abr/i,
            /^may/i,
            /^jun/i,
            /^jul/i,
            /^ago/i,
            /^sep/i,
            /^oct/i,
            /^nov/i,
            /^dic/i,
          ],
          r =
            /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;
        e.defineLocale('es-do', {
          months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
          monthsShort: function (e, a) {
            return e ? (/-MMM-/.test(a) ? n[e.month()] : t[e.month()]) : t;
          },
          monthsRegex: r,
          monthsShortRegex: r,
          monthsStrictRegex:
            /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
          monthsShortStrictRegex:
            /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
          monthsParse: a,
          longMonthsParse: a,
          shortMonthsParse: a,
          weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
          weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
          weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'h:mm A',
            LTS: 'h:mm:ss A',
            L: 'DD/MM/YYYY',
            LL: 'D [de] MMMM [de] YYYY',
            LLL: 'D [de] MMMM [de] YYYY h:mm A',
            LLLL: 'dddd, D [de] MMMM [de] YYYY h:mm A',
          },
          calendar: {
            sameDay: function () {
              return '[hoy a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            nextDay: function () {
              return '[mañana a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            nextWeek: function () {
              return 'dddd [a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            lastDay: function () {
              return '[ayer a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            lastWeek: function () {
              return '[el] dddd [pasado a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'en %s',
            past: 'hace %s',
            s: 'unos segundos',
            ss: '%d segundos',
            m: 'un minuto',
            mm: '%d minutos',
            h: 'una hora',
            hh: '%d horas',
            d: 'un día',
            dd: '%d días',
            w: 'una semana',
            ww: '%d semanas',
            M: 'un mes',
            MM: '%d meses',
            y: 'un año',
            yy: '%d años',
          },
          dayOfMonthOrdinalParse: /\d{1,2}º/,
          ordinal: '%dº',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1839: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
          n = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
          a = [
            /^ene/i,
            /^feb/i,
            /^mar/i,
            /^abr/i,
            /^may/i,
            /^jun/i,
            /^jul/i,
            /^ago/i,
            /^sep/i,
            /^oct/i,
            /^nov/i,
            /^dic/i,
          ],
          r =
            /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;
        e.defineLocale('es-mx', {
          months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
          monthsShort: function (e, a) {
            return e ? (/-MMM-/.test(a) ? n[e.month()] : t[e.month()]) : t;
          },
          monthsRegex: r,
          monthsShortRegex: r,
          monthsStrictRegex:
            /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
          monthsShortStrictRegex:
            /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
          monthsParse: a,
          longMonthsParse: a,
          shortMonthsParse: a,
          weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
          weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
          weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D [de] MMMM [de] YYYY',
            LLL: 'D [de] MMMM [de] YYYY H:mm',
            LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm',
          },
          calendar: {
            sameDay: function () {
              return '[hoy a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            nextDay: function () {
              return '[mañana a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            nextWeek: function () {
              return 'dddd [a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            lastDay: function () {
              return '[ayer a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            lastWeek: function () {
              return '[el] dddd [pasado a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'en %s',
            past: 'hace %s',
            s: 'unos segundos',
            ss: '%d segundos',
            m: 'un minuto',
            mm: '%d minutos',
            h: 'una hora',
            hh: '%d horas',
            d: 'un día',
            dd: '%d días',
            w: 'una semana',
            ww: '%d semanas',
            M: 'un mes',
            MM: '%d meses',
            y: 'un año',
            yy: '%d años',
          },
          dayOfMonthOrdinalParse: /\d{1,2}º/,
          ordinal: '%dº',
          week: { dow: 0, doy: 4 },
          invalidDate: 'Fecha inválida',
        });
      })(n(1781));
    },
    1840: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
          n = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
          a = [
            /^ene/i,
            /^feb/i,
            /^mar/i,
            /^abr/i,
            /^may/i,
            /^jun/i,
            /^jul/i,
            /^ago/i,
            /^sep/i,
            /^oct/i,
            /^nov/i,
            /^dic/i,
          ],
          r =
            /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;
        e.defineLocale('es-us', {
          months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
          monthsShort: function (e, a) {
            return e ? (/-MMM-/.test(a) ? n[e.month()] : t[e.month()]) : t;
          },
          monthsRegex: r,
          monthsShortRegex: r,
          monthsStrictRegex:
            /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
          monthsShortStrictRegex:
            /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
          monthsParse: a,
          longMonthsParse: a,
          shortMonthsParse: a,
          weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
          weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
          weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'h:mm A',
            LTS: 'h:mm:ss A',
            L: 'MM/DD/YYYY',
            LL: 'D [de] MMMM [de] YYYY',
            LLL: 'D [de] MMMM [de] YYYY h:mm A',
            LLLL: 'dddd, D [de] MMMM [de] YYYY h:mm A',
          },
          calendar: {
            sameDay: function () {
              return '[hoy a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            nextDay: function () {
              return '[mañana a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            nextWeek: function () {
              return 'dddd [a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            lastDay: function () {
              return '[ayer a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            lastWeek: function () {
              return '[el] dddd [pasado a la' + (1 !== this.hours() ? 's' : '') + '] LT';
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'en %s',
            past: 'hace %s',
            s: 'unos segundos',
            ss: '%d segundos',
            m: 'un minuto',
            mm: '%d minutos',
            h: 'una hora',
            hh: '%d horas',
            d: 'un día',
            dd: '%d días',
            w: 'una semana',
            ww: '%d semanas',
            M: 'un mes',
            MM: '%d meses',
            y: 'un año',
            yy: '%d años',
          },
          dayOfMonthOrdinalParse: /\d{1,2}º/,
          ordinal: '%dº',
          week: { dow: 0, doy: 6 },
        });
      })(n(1781));
    },
    1841: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n, a) {
          var r = {
            s: ['mõne sekundi', 'mõni sekund', 'paar sekundit'],
            ss: [e + 'sekundi', e + 'sekundit'],
            m: ['ühe minuti', 'üks minut'],
            mm: [e + ' minuti', e + ' minutit'],
            h: ['ühe tunni', 'tund aega', 'üks tund'],
            hh: [e + ' tunni', e + ' tundi'],
            d: ['ühe päeva', 'üks päev'],
            M: ['kuu aja', 'kuu aega', 'üks kuu'],
            MM: [e + ' kuu', e + ' kuud'],
            y: ['ühe aasta', 'aasta', 'üks aasta'],
            yy: [e + ' aasta', e + ' aastat'],
          };
          return t ? (r[n][2] ? r[n][2] : r[n][1]) : a ? r[n][0] : r[n][1];
        }
        e.defineLocale('et', {
          months: 'jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember'.split(
            '_',
          ),
          monthsShort: 'jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets'.split('_'),
          weekdays: 'pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev'.split('_'),
          weekdaysShort: 'P_E_T_K_N_R_L'.split('_'),
          weekdaysMin: 'P_E_T_K_N_R_L'.split('_'),
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY H:mm',
            LLLL: 'dddd, D. MMMM YYYY H:mm',
          },
          calendar: {
            sameDay: '[Täna,] LT',
            nextDay: '[Homme,] LT',
            nextWeek: '[Järgmine] dddd LT',
            lastDay: '[Eile,] LT',
            lastWeek: '[Eelmine] dddd LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s pärast',
            past: '%s tagasi',
            s: t,
            ss: t,
            m: t,
            mm: t,
            h: t,
            hh: t,
            d: t,
            dd: '%d päeva',
            M: t,
            MM: t,
            y: t,
            yy: t,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1842: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('eu', {
          months: 'urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua'.split(
            '_',
          ),
          monthsShort: 'urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata'.split('_'),
          weekdaysShort: 'ig._al._ar._az._og._ol._lr.'.split('_'),
          weekdaysMin: 'ig_al_ar_az_og_ol_lr'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'YYYY-MM-DD',
            LL: 'YYYY[ko] MMMM[ren] D[a]',
            LLL: 'YYYY[ko] MMMM[ren] D[a] HH:mm',
            LLLL: 'dddd, YYYY[ko] MMMM[ren] D[a] HH:mm',
            l: 'YYYY-M-D',
            ll: 'YYYY[ko] MMM D[a]',
            lll: 'YYYY[ko] MMM D[a] HH:mm',
            llll: 'ddd, YYYY[ko] MMM D[a] HH:mm',
          },
          calendar: {
            sameDay: '[gaur] LT[etan]',
            nextDay: '[bihar] LT[etan]',
            nextWeek: 'dddd LT[etan]',
            lastDay: '[atzo] LT[etan]',
            lastWeek: '[aurreko] dddd LT[etan]',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s barru',
            past: 'duela %s',
            s: 'segundo batzuk',
            ss: '%d segundo',
            m: 'minutu bat',
            mm: '%d minutu',
            h: 'ordu bat',
            hh: '%d ordu',
            d: 'egun bat',
            dd: '%d egun',
            M: 'hilabete bat',
            MM: '%d hilabete',
            y: 'urte bat',
            yy: '%d urte',
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1843: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹', 0: '۰' },
          n = { '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9', '۰': '0' };
        e.defineLocale('fa', {
          months: 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
          monthsShort: 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
          weekdays: 'یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه'.split('_'),
          weekdaysShort: 'یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه'.split('_'),
          weekdaysMin: 'ی_د_س_چ_پ_ج_ش'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          meridiemParse: /قبل از ظهر|بعد از ظهر/,
          isPM: function (e) {
            return /بعد از ظهر/.test(e);
          },
          meridiem: function (e, t, n) {
            return e < 12 ? 'قبل از ظهر' : 'بعد از ظهر';
          },
          calendar: {
            sameDay: '[امروز ساعت] LT',
            nextDay: '[فردا ساعت] LT',
            nextWeek: 'dddd [ساعت] LT',
            lastDay: '[دیروز ساعت] LT',
            lastWeek: 'dddd [پیش] [ساعت] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'در %s',
            past: '%s پیش',
            s: 'چند ثانیه',
            ss: '%d ثانیه',
            m: 'یک دقیقه',
            mm: '%d دقیقه',
            h: 'یک ساعت',
            hh: '%d ساعت',
            d: 'یک روز',
            dd: '%d روز',
            M: 'یک ماه',
            MM: '%d ماه',
            y: 'یک سال',
            yy: '%d سال',
          },
          preparse: function (e) {
            return e
              .replace(/[۰-۹]/g, function (e) {
                return n[e];
              })
              .replace(/،/g, ',');
          },
          postformat: function (e) {
            return e
              .replace(/\d/g, function (e) {
                return t[e];
              })
              .replace(/,/g, '،');
          },
          dayOfMonthOrdinalParse: /\d{1,2}م/,
          ordinal: '%dم',
          week: { dow: 6, doy: 12 },
        });
      })(n(1781));
    },
    1844: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = 'nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän'.split(' '),
          n = ['nolla', 'yhden', 'kahden', 'kolmen', 'neljän', 'viiden', 'kuuden', t[7], t[8], t[9]];
        function a(e, a, r, i) {
          var s = '';
          switch (r) {
            case 's':
              return i ? 'muutaman sekunnin' : 'muutama sekunti';
            case 'ss':
              s = i ? 'sekunnin' : 'sekuntia';
              break;
            case 'm':
              return i ? 'minuutin' : 'minuutti';
            case 'mm':
              s = i ? 'minuutin' : 'minuuttia';
              break;
            case 'h':
              return i ? 'tunnin' : 'tunti';
            case 'hh':
              s = i ? 'tunnin' : 'tuntia';
              break;
            case 'd':
              return i ? 'päivän' : 'päivä';
            case 'dd':
              s = i ? 'päivän' : 'päivää';
              break;
            case 'M':
              return i ? 'kuukauden' : 'kuukausi';
            case 'MM':
              s = i ? 'kuukauden' : 'kuukautta';
              break;
            case 'y':
              return i ? 'vuoden' : 'vuosi';
            case 'yy':
              s = i ? 'vuoden' : 'vuotta';
          }
          return (s =
            (function (e, a) {
              return e < 10 ? (a ? n[e] : t[e]) : e;
            })(e, i) +
            ' ' +
            s);
        }
        e.defineLocale('fi', {
          months:
            'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split(
              '_',
            ),
          monthsShort: 'tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu'.split('_'),
          weekdays: 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split('_'),
          weekdaysShort: 'su_ma_ti_ke_to_pe_la'.split('_'),
          weekdaysMin: 'su_ma_ti_ke_to_pe_la'.split('_'),
          longDateFormat: {
            LT: 'HH.mm',
            LTS: 'HH.mm.ss',
            L: 'DD.MM.YYYY',
            LL: 'Do MMMM[ta] YYYY',
            LLL: 'Do MMMM[ta] YYYY, [klo] HH.mm',
            LLLL: 'dddd, Do MMMM[ta] YYYY, [klo] HH.mm',
            l: 'D.M.YYYY',
            ll: 'Do MMM YYYY',
            lll: 'Do MMM YYYY, [klo] HH.mm',
            llll: 'ddd, Do MMM YYYY, [klo] HH.mm',
          },
          calendar: {
            sameDay: '[tänään] [klo] LT',
            nextDay: '[huomenna] [klo] LT',
            nextWeek: 'dddd [klo] LT',
            lastDay: '[eilen] [klo] LT',
            lastWeek: '[viime] dddd[na] [klo] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s päästä',
            past: '%s sitten',
            s: a,
            ss: a,
            m: a,
            mm: a,
            h: a,
            hh: a,
            d: a,
            dd: a,
            M: a,
            MM: a,
            y: a,
            yy: a,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1845: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('fil', {
          months: 'Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre'.split('_'),
          monthsShort: 'Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis'.split('_'),
          weekdays: 'Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado'.split('_'),
          weekdaysShort: 'Lin_Lun_Mar_Miy_Huw_Biy_Sab'.split('_'),
          weekdaysMin: 'Li_Lu_Ma_Mi_Hu_Bi_Sab'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'MM/D/YYYY',
            LL: 'MMMM D, YYYY',
            LLL: 'MMMM D, YYYY HH:mm',
            LLLL: 'dddd, MMMM DD, YYYY HH:mm',
          },
          calendar: {
            sameDay: 'LT [ngayong araw]',
            nextDay: '[Bukas ng] LT',
            nextWeek: 'LT [sa susunod na] dddd',
            lastDay: 'LT [kahapon]',
            lastWeek: 'LT [noong nakaraang] dddd',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'sa loob ng %s',
            past: '%s ang nakalipas',
            s: 'ilang segundo',
            ss: '%d segundo',
            m: 'isang minuto',
            mm: '%d minuto',
            h: 'isang oras',
            hh: '%d oras',
            d: 'isang araw',
            dd: '%d araw',
            M: 'isang buwan',
            MM: '%d buwan',
            y: 'isang taon',
            yy: '%d taon',
          },
          dayOfMonthOrdinalParse: /\d{1,2}/,
          ordinal: function (e) {
            return e;
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1846: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('fo', {
          months: 'januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
          monthsShort: 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
          weekdays: 'sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur'.split('_'),
          weekdaysShort: 'sun_mán_týs_mik_hós_frí_ley'.split('_'),
          weekdaysMin: 'su_má_tý_mi_hó_fr_le'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D. MMMM, YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Í dag kl.] LT',
            nextDay: '[Í morgin kl.] LT',
            nextWeek: 'dddd [kl.] LT',
            lastDay: '[Í gjár kl.] LT',
            lastWeek: '[síðstu] dddd [kl] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'um %s',
            past: '%s síðani',
            s: 'fá sekund',
            ss: '%d sekundir',
            m: 'ein minuttur',
            mm: '%d minuttir',
            h: 'ein tími',
            hh: '%d tímar',
            d: 'ein dagur',
            dd: '%d dagar',
            M: 'ein mánaður',
            MM: '%d mánaðir',
            y: 'eitt ár',
            yy: '%d ár',
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1847: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t =
            /(janv\.?|févr\.?|mars|avr\.?|mai|juin|juil\.?|août|sept\.?|oct\.?|nov\.?|déc\.?|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i,
          n = [
            /^janv/i,
            /^févr/i,
            /^mars/i,
            /^avr/i,
            /^mai/i,
            /^juin/i,
            /^juil/i,
            /^août/i,
            /^sept/i,
            /^oct/i,
            /^nov/i,
            /^déc/i,
          ];
        e.defineLocale('fr', {
          months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
          monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
          monthsRegex: t,
          monthsShortRegex: t,
          monthsStrictRegex: /^(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i,
          monthsShortStrictRegex: /(janv\.?|févr\.?|mars|avr\.?|mai|juin|juil\.?|août|sept\.?|oct\.?|nov\.?|déc\.?)/i,
          monthsParse: n,
          longMonthsParse: n,
          shortMonthsParse: n,
          weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
          weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
          weekdaysMin: 'di_lu_ma_me_je_ve_sa'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Aujourd’hui à] LT',
            nextDay: '[Demain à] LT',
            nextWeek: 'dddd [à] LT',
            lastDay: '[Hier à] LT',
            lastWeek: 'dddd [dernier à] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'dans %s',
            past: 'il y a %s',
            s: 'quelques secondes',
            ss: '%d secondes',
            m: 'une minute',
            mm: '%d minutes',
            h: 'une heure',
            hh: '%d heures',
            d: 'un jour',
            dd: '%d jours',
            w: 'une semaine',
            ww: '%d semaines',
            M: 'un mois',
            MM: '%d mois',
            y: 'un an',
            yy: '%d ans',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(er|)/,
          ordinal: function (e, t) {
            switch (t) {
              case 'D':
                return e + (1 === e ? 'er' : '');
              default:
              case 'M':
              case 'Q':
              case 'DDD':
              case 'd':
                return e + (1 === e ? 'er' : 'e');
              case 'w':
              case 'W':
                return e + (1 === e ? 're' : 'e');
            }
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1848: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('fr-ca', {
          months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
          monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
          weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
          weekdaysMin: 'di_lu_ma_me_je_ve_sa'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'YYYY-MM-DD',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Aujourd’hui à] LT',
            nextDay: '[Demain à] LT',
            nextWeek: 'dddd [à] LT',
            lastDay: '[Hier à] LT',
            lastWeek: 'dddd [dernier à] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'dans %s',
            past: 'il y a %s',
            s: 'quelques secondes',
            ss: '%d secondes',
            m: 'une minute',
            mm: '%d minutes',
            h: 'une heure',
            hh: '%d heures',
            d: 'un jour',
            dd: '%d jours',
            M: 'un mois',
            MM: '%d mois',
            y: 'un an',
            yy: '%d ans',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
          ordinal: function (e, t) {
            switch (t) {
              default:
              case 'M':
              case 'Q':
              case 'D':
              case 'DDD':
              case 'd':
                return e + (1 === e ? 'er' : 'e');
              case 'w':
              case 'W':
                return e + (1 === e ? 're' : 'e');
            }
          },
        });
      })(n(1781));
    },
    1849: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('fr-ch', {
          months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
          monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
          weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
          weekdaysMin: 'di_lu_ma_me_je_ve_sa'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Aujourd’hui à] LT',
            nextDay: '[Demain à] LT',
            nextWeek: 'dddd [à] LT',
            lastDay: '[Hier à] LT',
            lastWeek: 'dddd [dernier à] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'dans %s',
            past: 'il y a %s',
            s: 'quelques secondes',
            ss: '%d secondes',
            m: 'une minute',
            mm: '%d minutes',
            h: 'une heure',
            hh: '%d heures',
            d: 'un jour',
            dd: '%d jours',
            M: 'un mois',
            MM: '%d mois',
            y: 'un an',
            yy: '%d ans',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
          ordinal: function (e, t) {
            switch (t) {
              default:
              case 'M':
              case 'Q':
              case 'D':
              case 'DDD':
              case 'd':
                return e + (1 === e ? 'er' : 'e');
              case 'w':
              case 'W':
                return e + (1 === e ? 're' : 'e');
            }
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1850: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = 'jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.'.split('_'),
          n = 'jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_');
        e.defineLocale('fy', {
          months:
            'jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber'.split('_'),
          monthsShort: function (e, a) {
            return e ? (/-MMM-/.test(a) ? n[e.month()] : t[e.month()]) : t;
          },
          monthsParseExact: !0,
          weekdays: 'snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon'.split('_'),
          weekdaysShort: 'si._mo._ti._wo._to._fr._so.'.split('_'),
          weekdaysMin: 'Si_Mo_Ti_Wo_To_Fr_So'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD-MM-YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[hjoed om] LT',
            nextDay: '[moarn om] LT',
            nextWeek: 'dddd [om] LT',
            lastDay: '[juster om] LT',
            lastWeek: '[ôfrûne] dddd [om] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'oer %s',
            past: '%s lyn',
            s: 'in pear sekonden',
            ss: '%d sekonden',
            m: 'ien minút',
            mm: '%d minuten',
            h: 'ien oere',
            hh: '%d oeren',
            d: 'ien dei',
            dd: '%d dagen',
            M: 'ien moanne',
            MM: '%d moannen',
            y: 'ien jier',
            yy: '%d jierren',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
          ordinal: function (e) {
            return e + (1 === e || 8 === e || e >= 20 ? 'ste' : 'de');
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1851: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('ga', {
          months: [
            'Eanáir',
            'Feabhra',
            'Márta',
            'Aibreán',
            'Bealtaine',
            'Meitheamh',
            'Iúil',
            'Lúnasa',
            'Meán Fómhair',
            'Deireadh Fómhair',
            'Samhain',
            'Nollaig',
          ],
          monthsShort: ['Ean', 'Feabh', 'Márt', 'Aib', 'Beal', 'Meith', 'Iúil', 'Lún', 'M.F.', 'D.F.', 'Samh', 'Noll'],
          monthsParseExact: !0,
          weekdays: ['Dé Domhnaigh', 'Dé Luain', 'Dé Máirt', 'Dé Céadaoin', 'Déardaoin', 'Dé hAoine', 'Dé Sathairn'],
          weekdaysShort: ['Domh', 'Luan', 'Máirt', 'Céad', 'Déar', 'Aoine', 'Sath'],
          weekdaysMin: ['Do', 'Lu', 'Má', 'Cé', 'Dé', 'A', 'Sa'],
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Inniu ag] LT',
            nextDay: '[Amárach ag] LT',
            nextWeek: 'dddd [ag] LT',
            lastDay: '[Inné ag] LT',
            lastWeek: 'dddd [seo caite] [ag] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'i %s',
            past: '%s ó shin',
            s: 'cúpla soicind',
            ss: '%d soicind',
            m: 'nóiméad',
            mm: '%d nóiméad',
            h: 'uair an chloig',
            hh: '%d uair an chloig',
            d: 'lá',
            dd: '%d lá',
            M: 'mí',
            MM: '%d míonna',
            y: 'bliain',
            yy: '%d bliain',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(d|na|mh)/,
          ordinal: function (e) {
            return e + (1 === e ? 'd' : e % 10 == 2 ? 'na' : 'mh');
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1852: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('gd', {
          months: [
            'Am Faoilleach',
            'An Gearran',
            'Am Màrt',
            'An Giblean',
            'An Cèitean',
            'An t-Ògmhios',
            'An t-Iuchar',
            'An Lùnastal',
            'An t-Sultain',
            'An Dàmhair',
            'An t-Samhain',
            'An Dùbhlachd',
          ],
          monthsShort: ['Faoi', 'Gear', 'Màrt', 'Gibl', 'Cèit', 'Ògmh', 'Iuch', 'Lùn', 'Sult', 'Dàmh', 'Samh', 'Dùbh'],
          monthsParseExact: !0,
          weekdays: ['Didòmhnaich', 'Diluain', 'Dimàirt', 'Diciadain', 'Diardaoin', 'Dihaoine', 'Disathairne'],
          weekdaysShort: ['Did', 'Dil', 'Dim', 'Dic', 'Dia', 'Dih', 'Dis'],
          weekdaysMin: ['Dò', 'Lu', 'Mà', 'Ci', 'Ar', 'Ha', 'Sa'],
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[An-diugh aig] LT',
            nextDay: '[A-màireach aig] LT',
            nextWeek: 'dddd [aig] LT',
            lastDay: '[An-dè aig] LT',
            lastWeek: 'dddd [seo chaidh] [aig] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'ann an %s',
            past: 'bho chionn %s',
            s: 'beagan diogan',
            ss: '%d diogan',
            m: 'mionaid',
            mm: '%d mionaidean',
            h: 'uair',
            hh: '%d uairean',
            d: 'latha',
            dd: '%d latha',
            M: 'mìos',
            MM: '%d mìosan',
            y: 'bliadhna',
            yy: '%d bliadhna',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(d|na|mh)/,
          ordinal: function (e) {
            return e + (1 === e ? 'd' : e % 10 == 2 ? 'na' : 'mh');
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1853: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('gl', {
          months: 'xaneiro_febreiro_marzo_abril_maio_xuño_xullo_agosto_setembro_outubro_novembro_decembro'.split('_'),
          monthsShort: 'xan._feb._mar._abr._mai._xuñ._xul._ago._set._out._nov._dec.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'domingo_luns_martes_mércores_xoves_venres_sábado'.split('_'),
          weekdaysShort: 'dom._lun._mar._mér._xov._ven._sáb.'.split('_'),
          weekdaysMin: 'do_lu_ma_mé_xo_ve_sá'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D [de] MMMM [de] YYYY',
            LLL: 'D [de] MMMM [de] YYYY H:mm',
            LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm',
          },
          calendar: {
            sameDay: function () {
              return '[hoxe ' + (1 !== this.hours() ? 'ás' : 'á') + '] LT';
            },
            nextDay: function () {
              return '[mañá ' + (1 !== this.hours() ? 'ás' : 'á') + '] LT';
            },
            nextWeek: function () {
              return 'dddd [' + (1 !== this.hours() ? 'ás' : 'a') + '] LT';
            },
            lastDay: function () {
              return '[onte ' + (1 !== this.hours() ? 'á' : 'a') + '] LT';
            },
            lastWeek: function () {
              return '[o] dddd [pasado ' + (1 !== this.hours() ? 'ás' : 'a') + '] LT';
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: function (e) {
              return 0 === e.indexOf('un') ? 'n' + e : 'en ' + e;
            },
            past: 'hai %s',
            s: 'uns segundos',
            ss: '%d segundos',
            m: 'un minuto',
            mm: '%d minutos',
            h: 'unha hora',
            hh: '%d horas',
            d: 'un día',
            dd: '%d días',
            M: 'un mes',
            MM: '%d meses',
            y: 'un ano',
            yy: '%d anos',
          },
          dayOfMonthOrdinalParse: /\d{1,2}º/,
          ordinal: '%dº',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1854: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n, a) {
          var r = {
            s: ['थोडया सॅकंडांनी', 'थोडे सॅकंड'],
            ss: [e + ' सॅकंडांनी', e + ' सॅकंड'],
            m: ['एका मिणटान', 'एक मिनूट'],
            mm: [e + ' मिणटांनी', e + ' मिणटां'],
            h: ['एका वरान', 'एक वर'],
            hh: [e + ' वरांनी', e + ' वरां'],
            d: ['एका दिसान', 'एक दीस'],
            dd: [e + ' दिसांनी', e + ' दीस'],
            M: ['एका म्हयन्यान', 'एक म्हयनो'],
            MM: [e + ' म्हयन्यानी', e + ' म्हयने'],
            y: ['एका वर्सान', 'एक वर्स'],
            yy: [e + ' वर्सांनी', e + ' वर्सां'],
          };
          return a ? r[n][0] : r[n][1];
        }
        e.defineLocale('gom-deva', {
          months: {
            standalone: 'जानेवारी_फेब्रुवारी_मार्च_एप्रील_मे_जून_जुलय_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर'.split(
              '_',
            ),
            format:
              'जानेवारीच्या_फेब्रुवारीच्या_मार्चाच्या_एप्रीलाच्या_मेयाच्या_जूनाच्या_जुलयाच्या_ऑगस्टाच्या_सप्टेंबराच्या_ऑक्टोबराच्या_नोव्हेंबराच्या_डिसेंबराच्या'.split(
                '_',
              ),
            isFormat: /MMMM(\s)+D[oD]?/,
          },
          monthsShort: 'जाने._फेब्रु._मार्च_एप्री._मे_जून_जुल._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'आयतार_सोमार_मंगळार_बुधवार_बिरेस्तार_सुक्रार_शेनवार'.split('_'),
          weekdaysShort: 'आयत._सोम._मंगळ._बुध._ब्रेस्त._सुक्र._शेन.'.split('_'),
          weekdaysMin: 'आ_सो_मं_बु_ब्रे_सु_शे'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'A h:mm [वाजतां]',
            LTS: 'A h:mm:ss [वाजतां]',
            L: 'DD-MM-YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY A h:mm [वाजतां]',
            LLLL: 'dddd, MMMM Do, YYYY, A h:mm [वाजतां]',
            llll: 'ddd, D MMM YYYY, A h:mm [वाजतां]',
          },
          calendar: {
            sameDay: '[आयज] LT',
            nextDay: '[फाल्यां] LT',
            nextWeek: '[फुडलो] dddd[,] LT',
            lastDay: '[काल] LT',
            lastWeek: '[फाटलो] dddd[,] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s',
            past: '%s आदीं',
            s: t,
            ss: t,
            m: t,
            mm: t,
            h: t,
            hh: t,
            d: t,
            dd: t,
            M: t,
            MM: t,
            y: t,
            yy: t,
          },
          dayOfMonthOrdinalParse: /\d{1,2}(वेर)/,
          ordinal: function (e, t) {
            switch (t) {
              case 'D':
                return e + 'वेर';
              default:
              case 'M':
              case 'Q':
              case 'DDD':
              case 'd':
              case 'w':
              case 'W':
                return e;
            }
          },
          week: { dow: 0, doy: 3 },
          meridiemParse: /राती|सकाळीं|दनपारां|सांजे/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'राती' === t
                ? e < 4
                  ? e
                  : e + 12
                : 'सकाळीं' === t
                ? e
                : 'दनपारां' === t
                ? e > 12
                  ? e
                  : e + 12
                : 'सांजे' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            return e < 4 ? 'राती' : e < 12 ? 'सकाळीं' : e < 16 ? 'दनपारां' : e < 20 ? 'सांजे' : 'राती';
          },
        });
      })(n(1781));
    },
    1855: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n, a) {
          var r = {
            s: ['thoddea sekondamni', 'thodde sekond'],
            ss: [e + ' sekondamni', e + ' sekond'],
            m: ['eka mintan', 'ek minut'],
            mm: [e + ' mintamni', e + ' mintam'],
            h: ['eka voran', 'ek vor'],
            hh: [e + ' voramni', e + ' voram'],
            d: ['eka disan', 'ek dis'],
            dd: [e + ' disamni', e + ' dis'],
            M: ['eka mhoinean', 'ek mhoino'],
            MM: [e + ' mhoineamni', e + ' mhoine'],
            y: ['eka vorsan', 'ek voros'],
            yy: [e + ' vorsamni', e + ' vorsam'],
          };
          return a ? r[n][0] : r[n][1];
        }
        e.defineLocale('gom-latn', {
          months: {
            standalone: 'Janer_Febrer_Mars_Abril_Mai_Jun_Julai_Agost_Setembr_Otubr_Novembr_Dezembr'.split('_'),
            format:
              'Janerachea_Febrerachea_Marsachea_Abrilachea_Maiachea_Junachea_Julaiachea_Agostachea_Setembrachea_Otubrachea_Novembrachea_Dezembrachea'.split(
                '_',
              ),
            isFormat: /MMMM(\s)+D[oD]?/,
          },
          monthsShort: 'Jan._Feb._Mars_Abr._Mai_Jun_Jul._Ago._Set._Otu._Nov._Dez.'.split('_'),
          monthsParseExact: !0,
          weekdays: "Aitar_Somar_Mongllar_Budhvar_Birestar_Sukrar_Son'var".split('_'),
          weekdaysShort: 'Ait._Som._Mon._Bud._Bre._Suk._Son.'.split('_'),
          weekdaysMin: 'Ai_Sm_Mo_Bu_Br_Su_Sn'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'A h:mm [vazta]',
            LTS: 'A h:mm:ss [vazta]',
            L: 'DD-MM-YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY A h:mm [vazta]',
            LLLL: 'dddd, MMMM Do, YYYY, A h:mm [vazta]',
            llll: 'ddd, D MMM YYYY, A h:mm [vazta]',
          },
          calendar: {
            sameDay: '[Aiz] LT',
            nextDay: '[Faleam] LT',
            nextWeek: '[Fuddlo] dddd[,] LT',
            lastDay: '[Kal] LT',
            lastWeek: '[Fattlo] dddd[,] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s',
            past: '%s adim',
            s: t,
            ss: t,
            m: t,
            mm: t,
            h: t,
            hh: t,
            d: t,
            dd: t,
            M: t,
            MM: t,
            y: t,
            yy: t,
          },
          dayOfMonthOrdinalParse: /\d{1,2}(er)/,
          ordinal: function (e, t) {
            switch (t) {
              case 'D':
                return e + 'er';
              default:
              case 'M':
              case 'Q':
              case 'DDD':
              case 'd':
              case 'w':
              case 'W':
                return e;
            }
          },
          week: { dow: 0, doy: 3 },
          meridiemParse: /rati|sokallim|donparam|sanje/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'rati' === t
                ? e < 4
                  ? e
                  : e + 12
                : 'sokallim' === t
                ? e
                : 'donparam' === t
                ? e > 12
                  ? e
                  : e + 12
                : 'sanje' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            return e < 4 ? 'rati' : e < 12 ? 'sokallim' : e < 16 ? 'donparam' : e < 20 ? 'sanje' : 'rati';
          },
        });
      })(n(1781));
    },
    1856: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '૧', 2: '૨', 3: '૩', 4: '૪', 5: '૫', 6: '૬', 7: '૭', 8: '૮', 9: '૯', 0: '૦' },
          n = { '૧': '1', '૨': '2', '૩': '3', '૪': '4', '૫': '5', '૬': '6', '૭': '7', '૮': '8', '૯': '9', '૦': '0' };
        e.defineLocale('gu', {
          months: 'જાન્યુઆરી_ફેબ્રુઆરી_માર્ચ_એપ્રિલ_મે_જૂન_જુલાઈ_ઑગસ્ટ_સપ્ટેમ્બર_ઑક્ટ્બર_નવેમ્બર_ડિસેમ્બર'.split('_'),
          monthsShort: 'જાન્યુ._ફેબ્રુ._માર્ચ_એપ્રિ._મે_જૂન_જુલા._ઑગ._સપ્ટે._ઑક્ટ્._નવે._ડિસે.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'રવિવાર_સોમવાર_મંગળવાર_બુધ્વાર_ગુરુવાર_શુક્રવાર_શનિવાર'.split('_'),
          weekdaysShort: 'રવિ_સોમ_મંગળ_બુધ્_ગુરુ_શુક્ર_શનિ'.split('_'),
          weekdaysMin: 'ર_સો_મં_બુ_ગુ_શુ_શ'.split('_'),
          longDateFormat: {
            LT: 'A h:mm વાગ્યે',
            LTS: 'A h:mm:ss વાગ્યે',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY, A h:mm વાગ્યે',
            LLLL: 'dddd, D MMMM YYYY, A h:mm વાગ્યે',
          },
          calendar: {
            sameDay: '[આજ] LT',
            nextDay: '[કાલે] LT',
            nextWeek: 'dddd, LT',
            lastDay: '[ગઇકાલે] LT',
            lastWeek: '[પાછલા] dddd, LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s મા',
            past: '%s પહેલા',
            s: 'અમુક પળો',
            ss: '%d સેકંડ',
            m: 'એક મિનિટ',
            mm: '%d મિનિટ',
            h: 'એક કલાક',
            hh: '%d કલાક',
            d: 'એક દિવસ',
            dd: '%d દિવસ',
            M: 'એક મહિનો',
            MM: '%d મહિનો',
            y: 'એક વર્ષ',
            yy: '%d વર્ષ',
          },
          preparse: function (e) {
            return e.replace(/[૧૨૩૪૫૬૭૮૯૦]/g, function (e) {
              return n[e];
            });
          },
          postformat: function (e) {
            return e.replace(/\d/g, function (e) {
              return t[e];
            });
          },
          meridiemParse: /રાત|બપોર|સવાર|સાંજ/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'રાત' === t
                ? e < 4
                  ? e
                  : e + 12
                : 'સવાર' === t
                ? e
                : 'બપોર' === t
                ? e >= 10
                  ? e
                  : e + 12
                : 'સાંજ' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            return e < 4 ? 'રાત' : e < 10 ? 'સવાર' : e < 17 ? 'બપોર' : e < 20 ? 'સાંજ' : 'રાત';
          },
          week: { dow: 0, doy: 6 },
        });
      })(n(1781));
    },
    1857: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('he', {
          months: 'ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר'.split('_'),
          monthsShort: 'ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳'.split('_'),
          weekdays: 'ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת'.split('_'),
          weekdaysShort: 'א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳'.split('_'),
          weekdaysMin: 'א_ב_ג_ד_ה_ו_ש'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D [ב]MMMM YYYY',
            LLL: 'D [ב]MMMM YYYY HH:mm',
            LLLL: 'dddd, D [ב]MMMM YYYY HH:mm',
            l: 'D/M/YYYY',
            ll: 'D MMM YYYY',
            lll: 'D MMM YYYY HH:mm',
            llll: 'ddd, D MMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[היום ב־]LT',
            nextDay: '[מחר ב־]LT',
            nextWeek: 'dddd [בשעה] LT',
            lastDay: '[אתמול ב־]LT',
            lastWeek: '[ביום] dddd [האחרון בשעה] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'בעוד %s',
            past: 'לפני %s',
            s: 'מספר שניות',
            ss: '%d שניות',
            m: 'דקה',
            mm: '%d דקות',
            h: 'שעה',
            hh: function (e) {
              return 2 === e ? 'שעתיים' : e + ' שעות';
            },
            d: 'יום',
            dd: function (e) {
              return 2 === e ? 'יומיים' : e + ' ימים';
            },
            M: 'חודש',
            MM: function (e) {
              return 2 === e ? 'חודשיים' : e + ' חודשים';
            },
            y: 'שנה',
            yy: function (e) {
              return 2 === e ? 'שנתיים' : e % 10 == 0 && 10 !== e ? e + ' שנה' : e + ' שנים';
            },
          },
          meridiemParse: /אחה"צ|לפנה"צ|אחרי הצהריים|לפני הצהריים|לפנות בוקר|בבוקר|בערב/i,
          isPM: function (e) {
            return /^(אחה"צ|אחרי הצהריים|בערב)$/.test(e);
          },
          meridiem: function (e, t, n) {
            return e < 5
              ? 'לפנות בוקר'
              : e < 10
              ? 'בבוקר'
              : e < 12
              ? n
                ? 'לפנה"צ'
                : 'לפני הצהריים'
              : e < 18
              ? n
                ? 'אחה"צ'
                : 'אחרי הצהריים'
              : 'בערב';
          },
        });
      })(n(1781));
    },
    1858: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '१', 2: '२', 3: '३', 4: '४', 5: '५', 6: '६', 7: '७', 8: '८', 9: '९', 0: '०' },
          n = { '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9', '०': '0' },
          a = [
            /^जन/i,
            /^फ़र|फर/i,
            /^मार्च/i,
            /^अप्रै/i,
            /^मई/i,
            /^जून/i,
            /^जुल/i,
            /^अग/i,
            /^सितं|सित/i,
            /^अक्टू/i,
            /^नव|नवं/i,
            /^दिसं|दिस/i,
          ];
        e.defineLocale('hi', {
          months: {
            format: 'जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर'.split('_'),
            standalone: 'जनवरी_फरवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितंबर_अक्टूबर_नवंबर_दिसंबर'.split('_'),
          },
          monthsShort: 'जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.'.split('_'),
          weekdays: 'रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
          weekdaysShort: 'रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि'.split('_'),
          weekdaysMin: 'र_सो_मं_बु_गु_शु_श'.split('_'),
          longDateFormat: {
            LT: 'A h:mm बजे',
            LTS: 'A h:mm:ss बजे',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY, A h:mm बजे',
            LLLL: 'dddd, D MMMM YYYY, A h:mm बजे',
          },
          monthsParse: a,
          longMonthsParse: a,
          shortMonthsParse: [
            /^जन/i,
            /^फ़र/i,
            /^मार्च/i,
            /^अप्रै/i,
            /^मई/i,
            /^जून/i,
            /^जुल/i,
            /^अग/i,
            /^सित/i,
            /^अक्टू/i,
            /^नव/i,
            /^दिस/i,
          ],
          monthsRegex:
            /^(जनवरी|जन\.?|फ़रवरी|फरवरी|फ़र\.?|मार्च?|अप्रैल|अप्रै\.?|मई?|जून?|जुलाई|जुल\.?|अगस्त|अग\.?|सितम्बर|सितंबर|सित\.?|अक्टूबर|अक्टू\.?|नवम्बर|नवंबर|नव\.?|दिसम्बर|दिसंबर|दिस\.?)/i,
          monthsShortRegex:
            /^(जनवरी|जन\.?|फ़रवरी|फरवरी|फ़र\.?|मार्च?|अप्रैल|अप्रै\.?|मई?|जून?|जुलाई|जुल\.?|अगस्त|अग\.?|सितम्बर|सितंबर|सित\.?|अक्टूबर|अक्टू\.?|नवम्बर|नवंबर|नव\.?|दिसम्बर|दिसंबर|दिस\.?)/i,
          monthsStrictRegex:
            /^(जनवरी?|फ़रवरी|फरवरी?|मार्च?|अप्रैल?|मई?|जून?|जुलाई?|अगस्त?|सितम्बर|सितंबर|सित?\.?|अक्टूबर|अक्टू\.?|नवम्बर|नवंबर?|दिसम्बर|दिसंबर?)/i,
          monthsShortStrictRegex: /^(जन\.?|फ़र\.?|मार्च?|अप्रै\.?|मई?|जून?|जुल\.?|अग\.?|सित\.?|अक्टू\.?|नव\.?|दिस\.?)/i,
          calendar: {
            sameDay: '[आज] LT',
            nextDay: '[कल] LT',
            nextWeek: 'dddd, LT',
            lastDay: '[कल] LT',
            lastWeek: '[पिछले] dddd, LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s में',
            past: '%s पहले',
            s: 'कुछ ही क्षण',
            ss: '%d सेकंड',
            m: 'एक मिनट',
            mm: '%d मिनट',
            h: 'एक घंटा',
            hh: '%d घंटे',
            d: 'एक दिन',
            dd: '%d दिन',
            M: 'एक महीने',
            MM: '%d महीने',
            y: 'एक वर्ष',
            yy: '%d वर्ष',
          },
          preparse: function (e) {
            return e.replace(/[१२३४५६७८९०]/g, function (e) {
              return n[e];
            });
          },
          postformat: function (e) {
            return e.replace(/\d/g, function (e) {
              return t[e];
            });
          },
          meridiemParse: /रात|सुबह|दोपहर|शाम/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'रात' === t
                ? e < 4
                  ? e
                  : e + 12
                : 'सुबह' === t
                ? e
                : 'दोपहर' === t
                ? e >= 10
                  ? e
                  : e + 12
                : 'शाम' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            return e < 4 ? 'रात' : e < 10 ? 'सुबह' : e < 17 ? 'दोपहर' : e < 20 ? 'शाम' : 'रात';
          },
          week: { dow: 0, doy: 6 },
        });
      })(n(1781));
    },
    1859: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n) {
          var a = e + ' ';
          switch (n) {
            case 'ss':
              return (a += 1 === e ? 'sekunda' : 2 === e || 3 === e || 4 === e ? 'sekunde' : 'sekundi');
            case 'm':
              return t ? 'jedna minuta' : 'jedne minute';
            case 'mm':
              return (a += 1 === e ? 'minuta' : 2 === e || 3 === e || 4 === e ? 'minute' : 'minuta');
            case 'h':
              return t ? 'jedan sat' : 'jednog sata';
            case 'hh':
              return (a += 1 === e ? 'sat' : 2 === e || 3 === e || 4 === e ? 'sata' : 'sati');
            case 'dd':
              return (a += 1 === e ? 'dan' : 'dana');
            case 'MM':
              return (a += 1 === e ? 'mjesec' : 2 === e || 3 === e || 4 === e ? 'mjeseca' : 'mjeseci');
            case 'yy':
              return (a += 1 === e ? 'godina' : 2 === e || 3 === e || 4 === e ? 'godine' : 'godina');
          }
        }
        e.defineLocale('hr', {
          months: {
            format:
              'siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca'.split(
                '_',
              ),
            standalone:
              'siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac'.split(
                '_',
              ),
          },
          monthsShort: 'sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
          weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
          weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'Do MMMM YYYY',
            LLL: 'Do MMMM YYYY H:mm',
            LLLL: 'dddd, Do MMMM YYYY H:mm',
          },
          calendar: {
            sameDay: '[danas u] LT',
            nextDay: '[sutra u] LT',
            nextWeek: function () {
              switch (this.day()) {
                case 0:
                  return '[u] [nedjelju] [u] LT';
                case 3:
                  return '[u] [srijedu] [u] LT';
                case 6:
                  return '[u] [subotu] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                  return '[u] dddd [u] LT';
              }
            },
            lastDay: '[jučer u] LT',
            lastWeek: function () {
              switch (this.day()) {
                case 0:
                  return '[prošlu] [nedjelju] [u] LT';
                case 3:
                  return '[prošlu] [srijedu] [u] LT';
                case 6:
                  return '[prošle] [subote] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                  return '[prošli] dddd [u] LT';
              }
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'za %s',
            past: 'prije %s',
            s: 'par sekundi',
            ss: t,
            m: t,
            mm: t,
            h: t,
            hh: t,
            d: 'dan',
            dd: t,
            M: 'mjesec',
            MM: t,
            y: 'godinu',
            yy: t,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1860: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = 'vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton'.split(' ');
        function n(e, t, n, a) {
          var r = e;
          switch (n) {
            case 's':
              return a || t ? 'néhány másodperc' : 'néhány másodperce';
            case 'ss':
              return r + (a || t) ? ' másodperc' : ' másodperce';
            case 'm':
              return 'egy' + (a || t ? ' perc' : ' perce');
            case 'mm':
              return r + (a || t ? ' perc' : ' perce');
            case 'h':
              return 'egy' + (a || t ? ' óra' : ' órája');
            case 'hh':
              return r + (a || t ? ' óra' : ' órája');
            case 'd':
              return 'egy' + (a || t ? ' nap' : ' napja');
            case 'dd':
              return r + (a || t ? ' nap' : ' napja');
            case 'M':
              return 'egy' + (a || t ? ' hónap' : ' hónapja');
            case 'MM':
              return r + (a || t ? ' hónap' : ' hónapja');
            case 'y':
              return 'egy' + (a || t ? ' év' : ' éve');
            case 'yy':
              return r + (a || t ? ' év' : ' éve');
          }
          return '';
        }
        function a(e) {
          return (e ? '' : '[múlt] ') + '[' + t[this.day()] + '] LT[-kor]';
        }
        e.defineLocale('hu', {
          months:
            'január_február_március_április_május_június_július_augusztus_szeptember_október_november_december'.split(
              '_',
            ),
          monthsShort: 'jan._feb._márc._ápr._máj._jún._júl._aug._szept._okt._nov._dec.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat'.split('_'),
          weekdaysShort: 'vas_hét_kedd_sze_csüt_pén_szo'.split('_'),
          weekdaysMin: 'v_h_k_sze_cs_p_szo'.split('_'),
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'YYYY.MM.DD.',
            LL: 'YYYY. MMMM D.',
            LLL: 'YYYY. MMMM D. H:mm',
            LLLL: 'YYYY. MMMM D., dddd H:mm',
          },
          meridiemParse: /de|du/i,
          isPM: function (e) {
            return 'u' === e.charAt(1).toLowerCase();
          },
          meridiem: function (e, t, n) {
            return e < 12 ? (!0 === n ? 'de' : 'DE') : !0 === n ? 'du' : 'DU';
          },
          calendar: {
            sameDay: '[ma] LT[-kor]',
            nextDay: '[holnap] LT[-kor]',
            nextWeek: function () {
              return a.call(this, !0);
            },
            lastDay: '[tegnap] LT[-kor]',
            lastWeek: function () {
              return a.call(this, !1);
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s múlva',
            past: '%s',
            s: n,
            ss: n,
            m: n,
            mm: n,
            h: n,
            hh: n,
            d: n,
            dd: n,
            M: n,
            MM: n,
            y: n,
            yy: n,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1861: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('hy-am', {
          months: {
            format:
              'հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի'.split(
                '_',
              ),
            standalone:
              'հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր'.split(
                '_',
              ),
          },
          monthsShort: 'հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ'.split('_'),
          weekdays: 'կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ'.split('_'),
          weekdaysShort: 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
          weekdaysMin: 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY թ.',
            LLL: 'D MMMM YYYY թ., HH:mm',
            LLLL: 'dddd, D MMMM YYYY թ., HH:mm',
          },
          calendar: {
            sameDay: '[այսօր] LT',
            nextDay: '[վաղը] LT',
            lastDay: '[երեկ] LT',
            nextWeek: function () {
              return 'dddd [օրը ժամը] LT';
            },
            lastWeek: function () {
              return '[անցած] dddd [օրը ժամը] LT';
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s հետո',
            past: '%s առաջ',
            s: 'մի քանի վայրկյան',
            ss: '%d վայրկյան',
            m: 'րոպե',
            mm: '%d րոպե',
            h: 'ժամ',
            hh: '%d ժամ',
            d: 'օր',
            dd: '%d օր',
            M: 'ամիս',
            MM: '%d ամիս',
            y: 'տարի',
            yy: '%d տարի',
          },
          meridiemParse: /գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,
          isPM: function (e) {
            return /^(ցերեկվա|երեկոյան)$/.test(e);
          },
          meridiem: function (e) {
            return e < 4 ? 'գիշերվա' : e < 12 ? 'առավոտվա' : e < 17 ? 'ցերեկվա' : 'երեկոյան';
          },
          dayOfMonthOrdinalParse: /\d{1,2}|\d{1,2}-(ին|րդ)/,
          ordinal: function (e, t) {
            switch (t) {
              case 'DDD':
              case 'w':
              case 'W':
              case 'DDDo':
                return 1 === e ? e + '-ին' : e + '-րդ';
              default:
                return e;
            }
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1862: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('id', {
          months: 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split('_'),
          monthsShort: 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Agt_Sep_Okt_Nov_Des'.split('_'),
          weekdays: 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'),
          weekdaysShort: 'Min_Sen_Sel_Rab_Kam_Jum_Sab'.split('_'),
          weekdaysMin: 'Mg_Sn_Sl_Rb_Km_Jm_Sb'.split('_'),
          longDateFormat: {
            LT: 'HH.mm',
            LTS: 'HH.mm.ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY [pukul] HH.mm',
            LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm',
          },
          meridiemParse: /pagi|siang|sore|malam/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'pagi' === t
                ? e
                : 'siang' === t
                ? e >= 11
                  ? e
                  : e + 12
                : 'sore' === t || 'malam' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            return e < 11 ? 'pagi' : e < 15 ? 'siang' : e < 19 ? 'sore' : 'malam';
          },
          calendar: {
            sameDay: '[Hari ini pukul] LT',
            nextDay: '[Besok pukul] LT',
            nextWeek: 'dddd [pukul] LT',
            lastDay: '[Kemarin pukul] LT',
            lastWeek: 'dddd [lalu pukul] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'dalam %s',
            past: '%s yang lalu',
            s: 'beberapa detik',
            ss: '%d detik',
            m: 'semenit',
            mm: '%d menit',
            h: 'sejam',
            hh: '%d jam',
            d: 'sehari',
            dd: '%d hari',
            M: 'sebulan',
            MM: '%d bulan',
            y: 'setahun',
            yy: '%d tahun',
          },
          week: { dow: 0, doy: 6 },
        });
      })(n(1781));
    },
    1863: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e) {
          return e % 100 == 11 || e % 10 != 1;
        }
        function n(e, n, a, r) {
          var i = e + ' ';
          switch (a) {
            case 's':
              return n || r ? 'nokkrar sekúndur' : 'nokkrum sekúndum';
            case 'ss':
              return t(e) ? i + (n || r ? 'sekúndur' : 'sekúndum') : i + 'sekúnda';
            case 'm':
              return n ? 'mínúta' : 'mínútu';
            case 'mm':
              return t(e) ? i + (n || r ? 'mínútur' : 'mínútum') : n ? i + 'mínúta' : i + 'mínútu';
            case 'hh':
              return t(e) ? i + (n || r ? 'klukkustundir' : 'klukkustundum') : i + 'klukkustund';
            case 'd':
              return n ? 'dagur' : r ? 'dag' : 'degi';
            case 'dd':
              return t(e) ? (n ? i + 'dagar' : i + (r ? 'daga' : 'dögum')) : n ? i + 'dagur' : i + (r ? 'dag' : 'degi');
            case 'M':
              return n ? 'mánuður' : r ? 'mánuð' : 'mánuði';
            case 'MM':
              return t(e)
                ? n
                  ? i + 'mánuðir'
                  : i + (r ? 'mánuði' : 'mánuðum')
                : n
                ? i + 'mánuður'
                : i + (r ? 'mánuð' : 'mánuði');
            case 'y':
              return n || r ? 'ár' : 'ári';
            case 'yy':
              return t(e) ? i + (n || r ? 'ár' : 'árum') : i + (n || r ? 'ár' : 'ári');
          }
        }
        e.defineLocale('is', {
          months: 'janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember'.split('_'),
          monthsShort: 'jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des'.split('_'),
          weekdays: 'sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur'.split('_'),
          weekdaysShort: 'sun_mán_þri_mið_fim_fös_lau'.split('_'),
          weekdaysMin: 'Su_Má_Þr_Mi_Fi_Fö_La'.split('_'),
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY [kl.] H:mm',
            LLLL: 'dddd, D. MMMM YYYY [kl.] H:mm',
          },
          calendar: {
            sameDay: '[í dag kl.] LT',
            nextDay: '[á morgun kl.] LT',
            nextWeek: 'dddd [kl.] LT',
            lastDay: '[í gær kl.] LT',
            lastWeek: '[síðasta] dddd [kl.] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'eftir %s',
            past: 'fyrir %s síðan',
            s: n,
            ss: n,
            m: n,
            mm: n,
            h: 'klukkustund',
            hh: n,
            d: n,
            dd: n,
            M: n,
            MM: n,
            y: n,
            yy: n,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1864: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('it', {
          months: 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split(
            '_',
          ),
          monthsShort: 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
          weekdays: 'domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato'.split('_'),
          weekdaysShort: 'dom_lun_mar_mer_gio_ven_sab'.split('_'),
          weekdaysMin: 'do_lu_ma_me_gi_ve_sa'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: function () {
              return '[Oggi a' + (this.hours() > 1 ? 'lle ' : 0 === this.hours() ? ' ' : "ll'") + ']LT';
            },
            nextDay: function () {
              return '[Domani a' + (this.hours() > 1 ? 'lle ' : 0 === this.hours() ? ' ' : "ll'") + ']LT';
            },
            nextWeek: function () {
              return 'dddd [a' + (this.hours() > 1 ? 'lle ' : 0 === this.hours() ? ' ' : "ll'") + ']LT';
            },
            lastDay: function () {
              return '[Ieri a' + (this.hours() > 1 ? 'lle ' : 0 === this.hours() ? ' ' : "ll'") + ']LT';
            },
            lastWeek: function () {
              switch (this.day()) {
                case 0:
                  return '[La scorsa] dddd [a' + (this.hours() > 1 ? 'lle ' : 0 === this.hours() ? ' ' : "ll'") + ']LT';
                default:
                  return '[Lo scorso] dddd [a' + (this.hours() > 1 ? 'lle ' : 0 === this.hours() ? ' ' : "ll'") + ']LT';
              }
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'tra %s',
            past: '%s fa',
            s: 'alcuni secondi',
            ss: '%d secondi',
            m: 'un minuto',
            mm: '%d minuti',
            h: "un'ora",
            hh: '%d ore',
            d: 'un giorno',
            dd: '%d giorni',
            w: 'una settimana',
            ww: '%d settimane',
            M: 'un mese',
            MM: '%d mesi',
            y: 'un anno',
            yy: '%d anni',
          },
          dayOfMonthOrdinalParse: /\d{1,2}º/,
          ordinal: '%dº',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1865: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('it-ch', {
          months: 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split(
            '_',
          ),
          monthsShort: 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
          weekdays: 'domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato'.split('_'),
          weekdaysShort: 'dom_lun_mar_mer_gio_ven_sab'.split('_'),
          weekdaysMin: 'do_lu_ma_me_gi_ve_sa'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Oggi alle] LT',
            nextDay: '[Domani alle] LT',
            nextWeek: 'dddd [alle] LT',
            lastDay: '[Ieri alle] LT',
            lastWeek: function () {
              switch (this.day()) {
                case 0:
                  return '[la scorsa] dddd [alle] LT';
                default:
                  return '[lo scorso] dddd [alle] LT';
              }
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: function (e) {
              return (/^[0-9].+$/.test(e) ? 'tra' : 'in') + ' ' + e;
            },
            past: '%s fa',
            s: 'alcuni secondi',
            ss: '%d secondi',
            m: 'un minuto',
            mm: '%d minuti',
            h: "un'ora",
            hh: '%d ore',
            d: 'un giorno',
            dd: '%d giorni',
            M: 'un mese',
            MM: '%d mesi',
            y: 'un anno',
            yy: '%d anni',
          },
          dayOfMonthOrdinalParse: /\d{1,2}º/,
          ordinal: '%dº',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1866: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('ja', {
          eras: [
            { since: '2019-05-01', offset: 1, name: '令和', narrow: '㋿', abbr: 'R' },
            { since: '1989-01-08', until: '2019-04-30', offset: 1, name: '平成', narrow: '㍻', abbr: 'H' },
            { since: '1926-12-25', until: '1989-01-07', offset: 1, name: '昭和', narrow: '㍼', abbr: 'S' },
            { since: '1912-07-30', until: '1926-12-24', offset: 1, name: '大正', narrow: '㍽', abbr: 'T' },
            { since: '1873-01-01', until: '1912-07-29', offset: 6, name: '明治', narrow: '㍾', abbr: 'M' },
            { since: '0001-01-01', until: '1873-12-31', offset: 1, name: '西暦', narrow: 'AD', abbr: 'AD' },
            { since: '0000-12-31', until: -1 / 0, offset: 1, name: '紀元前', narrow: 'BC', abbr: 'BC' },
          ],
          eraYearOrdinalRegex: /(元|\d+)年/,
          eraYearOrdinalParse: function (e, t) {
            return '元' === t[1] ? 1 : parseInt(t[1] || e, 10);
          },
          months: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
          monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
          weekdays: '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
          weekdaysShort: '日_月_火_水_木_金_土'.split('_'),
          weekdaysMin: '日_月_火_水_木_金_土'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'YYYY/MM/DD',
            LL: 'YYYY年M月D日',
            LLL: 'YYYY年M月D日 HH:mm',
            LLLL: 'YYYY年M月D日 dddd HH:mm',
            l: 'YYYY/MM/DD',
            ll: 'YYYY年M月D日',
            lll: 'YYYY年M月D日 HH:mm',
            llll: 'YYYY年M月D日(ddd) HH:mm',
          },
          meridiemParse: /午前|午後/i,
          isPM: function (e) {
            return '午後' === e;
          },
          meridiem: function (e, t, n) {
            return e < 12 ? '午前' : '午後';
          },
          calendar: {
            sameDay: '[今日] LT',
            nextDay: '[明日] LT',
            nextWeek: function (e) {
              return e.week() !== this.week() ? '[来週]dddd LT' : 'dddd LT';
            },
            lastDay: '[昨日] LT',
            lastWeek: function (e) {
              return this.week() !== e.week() ? '[先週]dddd LT' : 'dddd LT';
            },
            sameElse: 'L',
          },
          dayOfMonthOrdinalParse: /\d{1,2}日/,
          ordinal: function (e, t) {
            switch (t) {
              case 'y':
                return 1 === e ? '元年' : e + '年';
              case 'd':
              case 'D':
              case 'DDD':
                return e + '日';
              default:
                return e;
            }
          },
          relativeTime: {
            future: '%s後',
            past: '%s前',
            s: '数秒',
            ss: '%d秒',
            m: '1分',
            mm: '%d分',
            h: '1時間',
            hh: '%d時間',
            d: '1日',
            dd: '%d日',
            M: '1ヶ月',
            MM: '%dヶ月',
            y: '1年',
            yy: '%d年',
          },
        });
      })(n(1781));
    },
    1867: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('jv', {
          months: 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember'.split('_'),
          monthsShort: 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des'.split('_'),
          weekdays: 'Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu'.split('_'),
          weekdaysShort: 'Min_Sen_Sel_Reb_Kem_Jem_Sep'.split('_'),
          weekdaysMin: 'Mg_Sn_Sl_Rb_Km_Jm_Sp'.split('_'),
          longDateFormat: {
            LT: 'HH.mm',
            LTS: 'HH.mm.ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY [pukul] HH.mm',
            LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm',
          },
          meridiemParse: /enjing|siyang|sonten|ndalu/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'enjing' === t
                ? e
                : 'siyang' === t
                ? e >= 11
                  ? e
                  : e + 12
                : 'sonten' === t || 'ndalu' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            return e < 11 ? 'enjing' : e < 15 ? 'siyang' : e < 19 ? 'sonten' : 'ndalu';
          },
          calendar: {
            sameDay: '[Dinten puniko pukul] LT',
            nextDay: '[Mbenjang pukul] LT',
            nextWeek: 'dddd [pukul] LT',
            lastDay: '[Kala wingi pukul] LT',
            lastWeek: 'dddd [kepengker pukul] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'wonten ing %s',
            past: '%s ingkang kepengker',
            s: 'sawetawis detik',
            ss: '%d detik',
            m: 'setunggal menit',
            mm: '%d menit',
            h: 'setunggal jam',
            hh: '%d jam',
            d: 'sedinten',
            dd: '%d dinten',
            M: 'sewulan',
            MM: '%d wulan',
            y: 'setaun',
            yy: '%d taun',
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1868: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('ka', {
          months:
            'იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი'.split(
              '_',
            ),
          monthsShort: 'იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ'.split('_'),
          weekdays: {
            standalone: 'კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი'.split('_'),
            format: 'კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს'.split('_'),
            isFormat: /(წინა|შემდეგ)/,
          },
          weekdaysShort: 'კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ'.split('_'),
          weekdaysMin: 'კვ_ორ_სა_ოთ_ხუ_პა_შა'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[დღეს] LT[-ზე]',
            nextDay: '[ხვალ] LT[-ზე]',
            lastDay: '[გუშინ] LT[-ზე]',
            nextWeek: '[შემდეგ] dddd LT[-ზე]',
            lastWeek: '[წინა] dddd LT-ზე',
            sameElse: 'L',
          },
          relativeTime: {
            future: function (e) {
              return e.replace(/(წამ|წუთ|საათ|წელ|დღ|თვ)(ი|ე)/, function (e, t, n) {
                return 'ი' === n ? t + 'ში' : t + n + 'ში';
              });
            },
            past: function (e) {
              return /(წამი|წუთი|საათი|დღე|თვე)/.test(e)
                ? e.replace(/(ი|ე)$/, 'ის წინ')
                : /წელი/.test(e)
                ? e.replace(/წელი$/, 'წლის წინ')
                : e;
            },
            s: 'რამდენიმე წამი',
            ss: '%d წამი',
            m: 'წუთი',
            mm: '%d წუთი',
            h: 'საათი',
            hh: '%d საათი',
            d: 'დღე',
            dd: '%d დღე',
            M: 'თვე',
            MM: '%d თვე',
            y: 'წელი',
            yy: '%d წელი',
          },
          dayOfMonthOrdinalParse: /0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,
          ordinal: function (e) {
            return 0 === e
              ? e
              : 1 === e
              ? e + '-ლი'
              : e < 20 || (e <= 100 && e % 20 == 0) || e % 100 == 0
              ? 'მე-' + e
              : e + '-ე';
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1869: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = {
          0: '-ші',
          1: '-ші',
          2: '-ші',
          3: '-ші',
          4: '-ші',
          5: '-ші',
          6: '-шы',
          7: '-ші',
          8: '-ші',
          9: '-шы',
          10: '-шы',
          20: '-шы',
          30: '-шы',
          40: '-шы',
          50: '-ші',
          60: '-шы',
          70: '-ші',
          80: '-ші',
          90: '-шы',
          100: '-ші',
        };
        e.defineLocale('kk', {
          months: 'қаңтар_ақпан_наурыз_сәуір_мамыр_маусым_шілде_тамыз_қыркүйек_қазан_қараша_желтоқсан'.split('_'),
          monthsShort: 'қаң_ақп_нау_сәу_мам_мау_шіл_там_қыр_қаз_қар_жел'.split('_'),
          weekdays: 'жексенбі_дүйсенбі_сейсенбі_сәрсенбі_бейсенбі_жұма_сенбі'.split('_'),
          weekdaysShort: 'жек_дүй_сей_сәр_бей_жұм_сен'.split('_'),
          weekdaysMin: 'жк_дй_сй_ср_бй_жм_сн'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Бүгін сағат] LT',
            nextDay: '[Ертең сағат] LT',
            nextWeek: 'dddd [сағат] LT',
            lastDay: '[Кеше сағат] LT',
            lastWeek: '[Өткен аптаның] dddd [сағат] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s ішінде',
            past: '%s бұрын',
            s: 'бірнеше секунд',
            ss: '%d секунд',
            m: 'бір минут',
            mm: '%d минут',
            h: 'бір сағат',
            hh: '%d сағат',
            d: 'бір күн',
            dd: '%d күн',
            M: 'бір ай',
            MM: '%d ай',
            y: 'бір жыл',
            yy: '%d жыл',
          },
          dayOfMonthOrdinalParse: /\d{1,2}-(ші|шы)/,
          ordinal: function (e) {
            return e + (t[e] || t[e % 10] || t[e >= 100 ? 100 : null]);
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1870: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '១', 2: '២', 3: '៣', 4: '៤', 5: '៥', 6: '៦', 7: '៧', 8: '៨', 9: '៩', 0: '០' },
          n = { '១': '1', '២': '2', '៣': '3', '៤': '4', '៥': '5', '៦': '6', '៧': '7', '៨': '8', '៩': '9', '០': '0' };
        e.defineLocale('km', {
          months: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
          monthsShort: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
          weekdays: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
          weekdaysShort: 'អា_ច_អ_ព_ព្រ_សុ_ស'.split('_'),
          weekdaysMin: 'អា_ច_អ_ព_ព្រ_សុ_ស'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          meridiemParse: /ព្រឹក|ល្ងាច/,
          isPM: function (e) {
            return 'ល្ងាច' === e;
          },
          meridiem: function (e, t, n) {
            return e < 12 ? 'ព្រឹក' : 'ល្ងាច';
          },
          calendar: {
            sameDay: '[ថ្ងៃនេះ ម៉ោង] LT',
            nextDay: '[ស្អែក ម៉ោង] LT',
            nextWeek: 'dddd [ម៉ោង] LT',
            lastDay: '[ម្សិលមិញ ម៉ោង] LT',
            lastWeek: 'dddd [សប្តាហ៍មុន] [ម៉ោង] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%sទៀត',
            past: '%sមុន',
            s: 'ប៉ុន្មានវិនាទី',
            ss: '%d វិនាទី',
            m: 'មួយនាទី',
            mm: '%d នាទី',
            h: 'មួយម៉ោង',
            hh: '%d ម៉ោង',
            d: 'មួយថ្ងៃ',
            dd: '%d ថ្ងៃ',
            M: 'មួយខែ',
            MM: '%d ខែ',
            y: 'មួយឆ្នាំ',
            yy: '%d ឆ្នាំ',
          },
          dayOfMonthOrdinalParse: /ទី\d{1,2}/,
          ordinal: 'ទី%d',
          preparse: function (e) {
            return e.replace(/[១២៣៤៥៦៧៨៩០]/g, function (e) {
              return n[e];
            });
          },
          postformat: function (e) {
            return e.replace(/\d/g, function (e) {
              return t[e];
            });
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1871: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '೧', 2: '೨', 3: '೩', 4: '೪', 5: '೫', 6: '೬', 7: '೭', 8: '೮', 9: '೯', 0: '೦' },
          n = { '೧': '1', '೨': '2', '೩': '3', '೪': '4', '೫': '5', '೬': '6', '೭': '7', '೮': '8', '೯': '9', '೦': '0' };
        e.defineLocale('kn', {
          months: 'ಜನವರಿ_ಫೆಬ್ರವರಿ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬರ್_ಅಕ್ಟೋಬರ್_ನವೆಂಬರ್_ಡಿಸೆಂಬರ್'.split(
            '_',
          ),
          monthsShort: 'ಜನ_ಫೆಬ್ರ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂ_ಅಕ್ಟೋ_ನವೆಂ_ಡಿಸೆಂ'.split('_'),
          monthsParseExact: !0,
          weekdays: 'ಭಾನುವಾರ_ಸೋಮವಾರ_ಮಂಗಳವಾರ_ಬುಧವಾರ_ಗುರುವಾರ_ಶುಕ್ರವಾರ_ಶನಿವಾರ'.split('_'),
          weekdaysShort: 'ಭಾನು_ಸೋಮ_ಮಂಗಳ_ಬುಧ_ಗುರು_ಶುಕ್ರ_ಶನಿ'.split('_'),
          weekdaysMin: 'ಭಾ_ಸೋ_ಮಂ_ಬು_ಗು_ಶು_ಶ'.split('_'),
          longDateFormat: {
            LT: 'A h:mm',
            LTS: 'A h:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY, A h:mm',
            LLLL: 'dddd, D MMMM YYYY, A h:mm',
          },
          calendar: {
            sameDay: '[ಇಂದು] LT',
            nextDay: '[ನಾಳೆ] LT',
            nextWeek: 'dddd, LT',
            lastDay: '[ನಿನ್ನೆ] LT',
            lastWeek: '[ಕೊನೆಯ] dddd, LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s ನಂತರ',
            past: '%s ಹಿಂದೆ',
            s: 'ಕೆಲವು ಕ್ಷಣಗಳು',
            ss: '%d ಸೆಕೆಂಡುಗಳು',
            m: 'ಒಂದು ನಿಮಿಷ',
            mm: '%d ನಿಮಿಷ',
            h: 'ಒಂದು ಗಂಟೆ',
            hh: '%d ಗಂಟೆ',
            d: 'ಒಂದು ದಿನ',
            dd: '%d ದಿನ',
            M: 'ಒಂದು ತಿಂಗಳು',
            MM: '%d ತಿಂಗಳು',
            y: 'ಒಂದು ವರ್ಷ',
            yy: '%d ವರ್ಷ',
          },
          preparse: function (e) {
            return e.replace(/[೧೨೩೪೫೬೭೮೯೦]/g, function (e) {
              return n[e];
            });
          },
          postformat: function (e) {
            return e.replace(/\d/g, function (e) {
              return t[e];
            });
          },
          meridiemParse: /ರಾತ್ರಿ|ಬೆಳಿಗ್ಗೆ|ಮಧ್ಯಾಹ್ನ|ಸಂಜೆ/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'ರಾತ್ರಿ' === t
                ? e < 4
                  ? e
                  : e + 12
                : 'ಬೆಳಿಗ್ಗೆ' === t
                ? e
                : 'ಮಧ್ಯಾಹ್ನ' === t
                ? e >= 10
                  ? e
                  : e + 12
                : 'ಸಂಜೆ' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            return e < 4 ? 'ರಾತ್ರಿ' : e < 10 ? 'ಬೆಳಿಗ್ಗೆ' : e < 17 ? 'ಮಧ್ಯಾಹ್ನ' : e < 20 ? 'ಸಂಜೆ' : 'ರಾತ್ರಿ';
          },
          dayOfMonthOrdinalParse: /\d{1,2}(ನೇ)/,
          ordinal: function (e) {
            return e + 'ನೇ';
          },
          week: { dow: 0, doy: 6 },
        });
      })(n(1781));
    },
    1872: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('ko', {
          months: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
          monthsShort: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
          weekdays: '일요일_월요일_화요일_수요일_목요일_금요일_토요일'.split('_'),
          weekdaysShort: '일_월_화_수_목_금_토'.split('_'),
          weekdaysMin: '일_월_화_수_목_금_토'.split('_'),
          longDateFormat: {
            LT: 'A h:mm',
            LTS: 'A h:mm:ss',
            L: 'YYYY.MM.DD.',
            LL: 'YYYY년 MMMM D일',
            LLL: 'YYYY년 MMMM D일 A h:mm',
            LLLL: 'YYYY년 MMMM D일 dddd A h:mm',
            l: 'YYYY.MM.DD.',
            ll: 'YYYY년 MMMM D일',
            lll: 'YYYY년 MMMM D일 A h:mm',
            llll: 'YYYY년 MMMM D일 dddd A h:mm',
          },
          calendar: {
            sameDay: '오늘 LT',
            nextDay: '내일 LT',
            nextWeek: 'dddd LT',
            lastDay: '어제 LT',
            lastWeek: '지난주 dddd LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s 후',
            past: '%s 전',
            s: '몇 초',
            ss: '%d초',
            m: '1분',
            mm: '%d분',
            h: '한 시간',
            hh: '%d시간',
            d: '하루',
            dd: '%d일',
            M: '한 달',
            MM: '%d달',
            y: '일 년',
            yy: '%d년',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(일|월|주)/,
          ordinal: function (e, t) {
            switch (t) {
              case 'd':
              case 'D':
              case 'DDD':
                return e + '일';
              case 'M':
                return e + '월';
              case 'w':
              case 'W':
                return e + '주';
              default:
                return e;
            }
          },
          meridiemParse: /오전|오후/,
          isPM: function (e) {
            return '오후' === e;
          },
          meridiem: function (e, t, n) {
            return e < 12 ? '오전' : '오후';
          },
        });
      })(n(1781));
    },
    1873: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '١', 2: '٢', 3: '٣', 4: '٤', 5: '٥', 6: '٦', 7: '٧', 8: '٨', 9: '٩', 0: '٠' },
          n = { '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9', '٠': '0' },
          a = [
            'کانونی دووەم',
            'شوبات',
            'ئازار',
            'نیسان',
            'ئایار',
            'حوزەیران',
            'تەمموز',
            'ئاب',
            'ئەیلوول',
            'تشرینی یەكەم',
            'تشرینی دووەم',
            'كانونی یەکەم',
          ];
        e.defineLocale('ku', {
          months: a,
          monthsShort: a,
          weekdays: 'یه‌كشه‌ممه‌_دووشه‌ممه‌_سێشه‌ممه‌_چوارشه‌ممه‌_پێنجشه‌ممه‌_هه‌ینی_شه‌ممه‌'.split('_'),
          weekdaysShort: 'یه‌كشه‌م_دووشه‌م_سێشه‌م_چوارشه‌م_پێنجشه‌م_هه‌ینی_شه‌ممه‌'.split('_'),
          weekdaysMin: 'ی_د_س_چ_پ_ه_ش'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          meridiemParse: /ئێواره‌|به‌یانی/,
          isPM: function (e) {
            return /ئێواره‌/.test(e);
          },
          meridiem: function (e, t, n) {
            return e < 12 ? 'به‌یانی' : 'ئێواره‌';
          },
          calendar: {
            sameDay: '[ئه‌مرۆ كاتژمێر] LT',
            nextDay: '[به‌یانی كاتژمێر] LT',
            nextWeek: 'dddd [كاتژمێر] LT',
            lastDay: '[دوێنێ كاتژمێر] LT',
            lastWeek: 'dddd [كاتژمێر] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'له‌ %s',
            past: '%s',
            s: 'چه‌ند چركه‌یه‌ك',
            ss: 'چركه‌ %d',
            m: 'یه‌ك خوله‌ك',
            mm: '%d خوله‌ك',
            h: 'یه‌ك كاتژمێر',
            hh: '%d كاتژمێر',
            d: 'یه‌ك ڕۆژ',
            dd: '%d ڕۆژ',
            M: 'یه‌ك مانگ',
            MM: '%d مانگ',
            y: 'یه‌ك ساڵ',
            yy: '%d ساڵ',
          },
          preparse: function (e) {
            return e
              .replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (e) {
                return n[e];
              })
              .replace(/،/g, ',');
          },
          postformat: function (e) {
            return e
              .replace(/\d/g, function (e) {
                return t[e];
              })
              .replace(/,/g, '،');
          },
          week: { dow: 6, doy: 12 },
        });
      })(n(1781));
    },
    1874: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = {
          0: '-чү',
          1: '-чи',
          2: '-чи',
          3: '-чү',
          4: '-чү',
          5: '-чи',
          6: '-чы',
          7: '-чи',
          8: '-чи',
          9: '-чу',
          10: '-чу',
          20: '-чы',
          30: '-чу',
          40: '-чы',
          50: '-чү',
          60: '-чы',
          70: '-чи',
          80: '-чи',
          90: '-чу',
          100: '-чү',
        };
        e.defineLocale('ky', {
          months: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
          monthsShort: 'янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split('_'),
          weekdays: 'Жекшемби_Дүйшөмбү_Шейшемби_Шаршемби_Бейшемби_Жума_Ишемби'.split('_'),
          weekdaysShort: 'Жек_Дүй_Шей_Шар_Бей_Жум_Ише'.split('_'),
          weekdaysMin: 'Жк_Дй_Шй_Шр_Бй_Жм_Иш'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Бүгүн саат] LT',
            nextDay: '[Эртең саат] LT',
            nextWeek: 'dddd [саат] LT',
            lastDay: '[Кечээ саат] LT',
            lastWeek: '[Өткөн аптанын] dddd [күнү] [саат] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s ичинде',
            past: '%s мурун',
            s: 'бирнече секунд',
            ss: '%d секунд',
            m: 'бир мүнөт',
            mm: '%d мүнөт',
            h: 'бир саат',
            hh: '%d саат',
            d: 'бир күн',
            dd: '%d күн',
            M: 'бир ай',
            MM: '%d ай',
            y: 'бир жыл',
            yy: '%d жыл',
          },
          dayOfMonthOrdinalParse: /\d{1,2}-(чи|чы|чү|чу)/,
          ordinal: function (e) {
            return e + (t[e] || t[e % 10] || t[e >= 100 ? 100 : null]);
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1875: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n, a) {
          var r = {
            m: ['eng Minutt', 'enger Minutt'],
            h: ['eng Stonn', 'enger Stonn'],
            d: ['een Dag', 'engem Dag'],
            M: ['ee Mount', 'engem Mount'],
            y: ['ee Joer', 'engem Joer'],
          };
          return t ? r[n][0] : r[n][1];
        }
        function n(e) {
          if (((e = parseInt(e, 10)), isNaN(e))) return !1;
          if (e < 0) return !0;
          if (e < 10) return 4 <= e && e <= 7;
          if (e < 100) {
            var t = e % 10;
            return n(0 === t ? e / 10 : t);
          }
          if (e < 1e4) {
            for (; e >= 10; ) e /= 10;
            return n(e);
          }
          return n((e /= 1e3));
        }
        e.defineLocale('lb', {
          months: 'Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
          monthsShort: 'Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg'.split('_'),
          weekdaysShort: 'So._Mé._Dë._Më._Do._Fr._Sa.'.split('_'),
          weekdaysMin: 'So_Mé_Dë_Më_Do_Fr_Sa'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'H:mm [Auer]',
            LTS: 'H:mm:ss [Auer]',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY H:mm [Auer]',
            LLLL: 'dddd, D. MMMM YYYY H:mm [Auer]',
          },
          calendar: {
            sameDay: '[Haut um] LT',
            sameElse: 'L',
            nextDay: '[Muer um] LT',
            nextWeek: 'dddd [um] LT',
            lastDay: '[Gëschter um] LT',
            lastWeek: function () {
              switch (this.day()) {
                case 2:
                case 4:
                  return '[Leschten] dddd [um] LT';
                default:
                  return '[Leschte] dddd [um] LT';
              }
            },
          },
          relativeTime: {
            future: function (e) {
              return n(e.substr(0, e.indexOf(' '))) ? 'a ' + e : 'an ' + e;
            },
            past: function (e) {
              return n(e.substr(0, e.indexOf(' '))) ? 'viru ' + e : 'virun ' + e;
            },
            s: 'e puer Sekonnen',
            ss: '%d Sekonnen',
            m: t,
            mm: '%d Minutten',
            h: t,
            hh: '%d Stonnen',
            d: t,
            dd: '%d Deeg',
            M: t,
            MM: '%d Méint',
            y: t,
            yy: '%d Joer',
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1876: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('lo', {
          months: 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
          monthsShort: 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
          weekdays: 'ອາທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
          weekdaysShort: 'ທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
          weekdaysMin: 'ທ_ຈ_ອຄ_ພ_ພຫ_ສກ_ສ'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'ວັນdddd D MMMM YYYY HH:mm',
          },
          meridiemParse: /ຕອນເຊົ້າ|ຕອນແລງ/,
          isPM: function (e) {
            return 'ຕອນແລງ' === e;
          },
          meridiem: function (e, t, n) {
            return e < 12 ? 'ຕອນເຊົ້າ' : 'ຕອນແລງ';
          },
          calendar: {
            sameDay: '[ມື້ນີ້ເວລາ] LT',
            nextDay: '[ມື້ອື່ນເວລາ] LT',
            nextWeek: '[ວັນ]dddd[ໜ້າເວລາ] LT',
            lastDay: '[ມື້ວານນີ້ເວລາ] LT',
            lastWeek: '[ວັນ]dddd[ແລ້ວນີ້ເວລາ] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'ອີກ %s',
            past: '%sຜ່ານມາ',
            s: 'ບໍ່ເທົ່າໃດວິນາທີ',
            ss: '%d ວິນາທີ',
            m: '1 ນາທີ',
            mm: '%d ນາທີ',
            h: '1 ຊົ່ວໂມງ',
            hh: '%d ຊົ່ວໂມງ',
            d: '1 ມື້',
            dd: '%d ມື້',
            M: '1 ເດືອນ',
            MM: '%d ເດືອນ',
            y: '1 ປີ',
            yy: '%d ປີ',
          },
          dayOfMonthOrdinalParse: /(ທີ່)\d{1,2}/,
          ordinal: function (e) {
            return 'ທີ່' + e;
          },
        });
      })(n(1781));
    },
    1877: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = {
          ss: 'sekundė_sekundžių_sekundes',
          m: 'minutė_minutės_minutę',
          mm: 'minutės_minučių_minutes',
          h: 'valanda_valandos_valandą',
          hh: 'valandos_valandų_valandas',
          d: 'diena_dienos_dieną',
          dd: 'dienos_dienų_dienas',
          M: 'mėnuo_mėnesio_mėnesį',
          MM: 'mėnesiai_mėnesių_mėnesius',
          y: 'metai_metų_metus',
          yy: 'metai_metų_metus',
        };
        function n(e, t, n, a) {
          return t ? r(n)[0] : a ? r(n)[1] : r(n)[2];
        }
        function a(e) {
          return e % 10 == 0 || (e > 10 && e < 20);
        }
        function r(e) {
          return t[e].split('_');
        }
        function i(e, t, i, s) {
          var o = e + ' ';
          return 1 === e
            ? o + n(0, t, i[0], s)
            : t
            ? o + (a(e) ? r(i)[1] : r(i)[0])
            : s
            ? o + r(i)[1]
            : o + (a(e) ? r(i)[1] : r(i)[2]);
        }
        e.defineLocale('lt', {
          months: {
            format:
              'sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio'.split(
                '_',
              ),
            standalone:
              'sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis'.split(
                '_',
              ),
            isFormat: /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?|MMMM?(\[[^\[\]]*\]|\s)+D[oD]?/,
          },
          monthsShort: 'sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd'.split('_'),
          weekdays: {
            format: 'sekmadienį_pirmadienį_antradienį_trečiadienį_ketvirtadienį_penktadienį_šeštadienį'.split('_'),
            standalone:
              'sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis'.split('_'),
            isFormat: /dddd HH:mm/,
          },
          weekdaysShort: 'Sek_Pir_Ant_Tre_Ket_Pen_Šeš'.split('_'),
          weekdaysMin: 'S_P_A_T_K_Pn_Š'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'YYYY-MM-DD',
            LL: 'YYYY [m.] MMMM D [d.]',
            LLL: 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
            LLLL: 'YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]',
            l: 'YYYY-MM-DD',
            ll: 'YYYY [m.] MMMM D [d.]',
            lll: 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
            llll: 'YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]',
          },
          calendar: {
            sameDay: '[Šiandien] LT',
            nextDay: '[Rytoj] LT',
            nextWeek: 'dddd LT',
            lastDay: '[Vakar] LT',
            lastWeek: '[Praėjusį] dddd LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'po %s',
            past: 'prieš %s',
            s: function (e, t, n, a) {
              return t ? 'kelios sekundės' : a ? 'kelių sekundžių' : 'kelias sekundes';
            },
            ss: i,
            m: n,
            mm: i,
            h: n,
            hh: i,
            d: n,
            dd: i,
            M: n,
            MM: i,
            y: n,
            yy: i,
          },
          dayOfMonthOrdinalParse: /\d{1,2}-oji/,
          ordinal: function (e) {
            return e + '-oji';
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1878: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = {
          ss: 'sekundes_sekundēm_sekunde_sekundes'.split('_'),
          m: 'minūtes_minūtēm_minūte_minūtes'.split('_'),
          mm: 'minūtes_minūtēm_minūte_minūtes'.split('_'),
          h: 'stundas_stundām_stunda_stundas'.split('_'),
          hh: 'stundas_stundām_stunda_stundas'.split('_'),
          d: 'dienas_dienām_diena_dienas'.split('_'),
          dd: 'dienas_dienām_diena_dienas'.split('_'),
          M: 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
          MM: 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
          y: 'gada_gadiem_gads_gadi'.split('_'),
          yy: 'gada_gadiem_gads_gadi'.split('_'),
        };
        function n(e, t, n) {
          return n ? (t % 10 == 1 && t % 100 != 11 ? e[2] : e[3]) : t % 10 == 1 && t % 100 != 11 ? e[0] : e[1];
        }
        function a(e, a, r) {
          return e + ' ' + n(t[r], e, a);
        }
        function r(e, a, r) {
          return n(t[r], e, a);
        }
        e.defineLocale('lv', {
          months:
            'janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris'.split(
              '_',
            ),
          monthsShort: 'jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec'.split('_'),
          weekdays: 'svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena'.split('_'),
          weekdaysShort: 'Sv_P_O_T_C_Pk_S'.split('_'),
          weekdaysMin: 'Sv_P_O_T_C_Pk_S'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY.',
            LL: 'YYYY. [gada] D. MMMM',
            LLL: 'YYYY. [gada] D. MMMM, HH:mm',
            LLLL: 'YYYY. [gada] D. MMMM, dddd, HH:mm',
          },
          calendar: {
            sameDay: '[Šodien pulksten] LT',
            nextDay: '[Rīt pulksten] LT',
            nextWeek: 'dddd [pulksten] LT',
            lastDay: '[Vakar pulksten] LT',
            lastWeek: '[Pagājušā] dddd [pulksten] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'pēc %s',
            past: 'pirms %s',
            s: function (e, t) {
              return t ? 'dažas sekundes' : 'dažām sekundēm';
            },
            ss: a,
            m: r,
            mm: a,
            h: r,
            hh: a,
            d: r,
            dd: a,
            M: r,
            MM: a,
            y: r,
            yy: a,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1879: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = {
          words: {
            ss: ['sekund', 'sekunda', 'sekundi'],
            m: ['jedan minut', 'jednog minuta'],
            mm: ['minut', 'minuta', 'minuta'],
            h: ['jedan sat', 'jednog sata'],
            hh: ['sat', 'sata', 'sati'],
            dd: ['dan', 'dana', 'dana'],
            MM: ['mjesec', 'mjeseca', 'mjeseci'],
            yy: ['godina', 'godine', 'godina'],
          },
          correctGrammaticalCase: function (e, t) {
            return 1 === e ? t[0] : e >= 2 && e <= 4 ? t[1] : t[2];
          },
          translate: function (e, n, a) {
            var r = t.words[a];
            return 1 === a.length ? (n ? r[0] : r[1]) : e + ' ' + t.correctGrammaticalCase(e, r);
          },
        };
        e.defineLocale('me', {
          months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
          monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
          weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
          weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY H:mm',
            LLLL: 'dddd, D. MMMM YYYY H:mm',
          },
          calendar: {
            sameDay: '[danas u] LT',
            nextDay: '[sjutra u] LT',
            nextWeek: function () {
              switch (this.day()) {
                case 0:
                  return '[u] [nedjelju] [u] LT';
                case 3:
                  return '[u] [srijedu] [u] LT';
                case 6:
                  return '[u] [subotu] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                  return '[u] dddd [u] LT';
              }
            },
            lastDay: '[juče u] LT',
            lastWeek: function () {
              return [
                '[prošle] [nedjelje] [u] LT',
                '[prošlog] [ponedjeljka] [u] LT',
                '[prošlog] [utorka] [u] LT',
                '[prošle] [srijede] [u] LT',
                '[prošlog] [četvrtka] [u] LT',
                '[prošlog] [petka] [u] LT',
                '[prošle] [subote] [u] LT',
              ][this.day()];
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'za %s',
            past: 'prije %s',
            s: 'nekoliko sekundi',
            ss: t.translate,
            m: t.translate,
            mm: t.translate,
            h: t.translate,
            hh: t.translate,
            d: 'dan',
            dd: t.translate,
            M: 'mjesec',
            MM: t.translate,
            y: 'godinu',
            yy: t.translate,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1880: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('mi', {
          months:
            'Kohi-tāte_Hui-tanguru_Poutū-te-rangi_Paenga-whāwhā_Haratua_Pipiri_Hōngoingoi_Here-turi-kōkā_Mahuru_Whiringa-ā-nuku_Whiringa-ā-rangi_Hakihea'.split(
              '_',
            ),
          monthsShort: 'Kohi_Hui_Pou_Pae_Hara_Pipi_Hōngoi_Here_Mahu_Whi-nu_Whi-ra_Haki'.split('_'),
          monthsRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
          monthsStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
          monthsShortRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
          monthsShortStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,2}/i,
          weekdays: 'Rātapu_Mane_Tūrei_Wenerei_Tāite_Paraire_Hātarei'.split('_'),
          weekdaysShort: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
          weekdaysMin: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY [i] HH:mm',
            LLLL: 'dddd, D MMMM YYYY [i] HH:mm',
          },
          calendar: {
            sameDay: '[i teie mahana, i] LT',
            nextDay: '[apopo i] LT',
            nextWeek: 'dddd [i] LT',
            lastDay: '[inanahi i] LT',
            lastWeek: 'dddd [whakamutunga i] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'i roto i %s',
            past: '%s i mua',
            s: 'te hēkona ruarua',
            ss: '%d hēkona',
            m: 'he meneti',
            mm: '%d meneti',
            h: 'te haora',
            hh: '%d haora',
            d: 'he ra',
            dd: '%d ra',
            M: 'he marama',
            MM: '%d marama',
            y: 'he tau',
            yy: '%d tau',
          },
          dayOfMonthOrdinalParse: /\d{1,2}º/,
          ordinal: '%dº',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1881: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('mk', {
          months: 'јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември'.split('_'),
          monthsShort: 'јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек'.split('_'),
          weekdays: 'недела_понеделник_вторник_среда_четврток_петок_сабота'.split('_'),
          weekdaysShort: 'нед_пон_вто_сре_чет_пет_саб'.split('_'),
          weekdaysMin: 'нe_пo_вт_ср_че_пе_сa'.split('_'),
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'D.MM.YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY H:mm',
            LLLL: 'dddd, D MMMM YYYY H:mm',
          },
          calendar: {
            sameDay: '[Денес во] LT',
            nextDay: '[Утре во] LT',
            nextWeek: '[Во] dddd [во] LT',
            lastDay: '[Вчера во] LT',
            lastWeek: function () {
              switch (this.day()) {
                case 0:
                case 3:
                case 6:
                  return '[Изминатата] dddd [во] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                  return '[Изминатиот] dddd [во] LT';
              }
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'за %s',
            past: 'пред %s',
            s: 'неколку секунди',
            ss: '%d секунди',
            m: 'една минута',
            mm: '%d минути',
            h: 'еден час',
            hh: '%d часа',
            d: 'еден ден',
            dd: '%d дена',
            M: 'еден месец',
            MM: '%d месеци',
            y: 'една година',
            yy: '%d години',
          },
          dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
          ordinal: function (e) {
            var t = e % 10,
              n = e % 100;
            return 0 === e
              ? e + '-ев'
              : 0 === n
              ? e + '-ен'
              : n > 10 && n < 20
              ? e + '-ти'
              : 1 === t
              ? e + '-ви'
              : 2 === t
              ? e + '-ри'
              : 7 === t || 8 === t
              ? e + '-ми'
              : e + '-ти';
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1882: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('ml', {
          months: 'ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ'.split('_'),
          monthsShort: 'ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച'.split('_'),
          weekdaysShort: 'ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി'.split('_'),
          weekdaysMin: 'ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ'.split('_'),
          longDateFormat: {
            LT: 'A h:mm -നു',
            LTS: 'A h:mm:ss -നു',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY, A h:mm -നു',
            LLLL: 'dddd, D MMMM YYYY, A h:mm -നു',
          },
          calendar: {
            sameDay: '[ഇന്ന്] LT',
            nextDay: '[നാളെ] LT',
            nextWeek: 'dddd, LT',
            lastDay: '[ഇന്നലെ] LT',
            lastWeek: '[കഴിഞ്ഞ] dddd, LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s കഴിഞ്ഞ്',
            past: '%s മുൻപ്',
            s: 'അൽപ നിമിഷങ്ങൾ',
            ss: '%d സെക്കൻഡ്',
            m: 'ഒരു മിനിറ്റ്',
            mm: '%d മിനിറ്റ്',
            h: 'ഒരു മണിക്കൂർ',
            hh: '%d മണിക്കൂർ',
            d: 'ഒരു ദിവസം',
            dd: '%d ദിവസം',
            M: 'ഒരു മാസം',
            MM: '%d മാസം',
            y: 'ഒരു വർഷം',
            yy: '%d വർഷം',
          },
          meridiemParse: /രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0), ('രാത്രി' === t && e >= 4) || 'ഉച്ച കഴിഞ്ഞ്' === t || 'വൈകുന്നേരം' === t ? e + 12 : e
            );
          },
          meridiem: function (e, t, n) {
            return e < 4 ? 'രാത്രി' : e < 12 ? 'രാവിലെ' : e < 17 ? 'ഉച്ച കഴിഞ്ഞ്' : e < 20 ? 'വൈകുന്നേരം' : 'രാത്രി';
          },
        });
      })(n(1781));
    },
    1883: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n, a) {
          switch (n) {
            case 's':
              return t ? 'хэдхэн секунд' : 'хэдхэн секундын';
            case 'ss':
              return e + (t ? ' секунд' : ' секундын');
            case 'm':
            case 'mm':
              return e + (t ? ' минут' : ' минутын');
            case 'h':
            case 'hh':
              return e + (t ? ' цаг' : ' цагийн');
            case 'd':
            case 'dd':
              return e + (t ? ' өдөр' : ' өдрийн');
            case 'M':
            case 'MM':
              return e + (t ? ' сар' : ' сарын');
            case 'y':
            case 'yy':
              return e + (t ? ' жил' : ' жилийн');
            default:
              return e;
          }
        }
        e.defineLocale('mn', {
          months:
            'Нэгдүгээр сар_Хоёрдугаар сар_Гуравдугаар сар_Дөрөвдүгээр сар_Тавдугаар сар_Зургадугаар сар_Долдугаар сар_Наймдугаар сар_Есдүгээр сар_Аравдугаар сар_Арван нэгдүгээр сар_Арван хоёрдугаар сар'.split(
              '_',
            ),
          monthsShort: '1 сар_2 сар_3 сар_4 сар_5 сар_6 сар_7 сар_8 сар_9 сар_10 сар_11 сар_12 сар'.split('_'),
          monthsParseExact: !0,
          weekdays: 'Ням_Даваа_Мягмар_Лхагва_Пүрэв_Баасан_Бямба'.split('_'),
          weekdaysShort: 'Ням_Дав_Мяг_Лха_Пүр_Баа_Бям'.split('_'),
          weekdaysMin: 'Ня_Да_Мя_Лх_Пү_Ба_Бя'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'YYYY-MM-DD',
            LL: 'YYYY оны MMMMын D',
            LLL: 'YYYY оны MMMMын D HH:mm',
            LLLL: 'dddd, YYYY оны MMMMын D HH:mm',
          },
          meridiemParse: /ҮӨ|ҮХ/i,
          isPM: function (e) {
            return 'ҮХ' === e;
          },
          meridiem: function (e, t, n) {
            return e < 12 ? 'ҮӨ' : 'ҮХ';
          },
          calendar: {
            sameDay: '[Өнөөдөр] LT',
            nextDay: '[Маргааш] LT',
            nextWeek: '[Ирэх] dddd LT',
            lastDay: '[Өчигдөр] LT',
            lastWeek: '[Өнгөрсөн] dddd LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s дараа',
            past: '%s өмнө',
            s: t,
            ss: t,
            m: t,
            mm: t,
            h: t,
            hh: t,
            d: t,
            dd: t,
            M: t,
            MM: t,
            y: t,
            yy: t,
          },
          dayOfMonthOrdinalParse: /\d{1,2} өдөр/,
          ordinal: function (e, t) {
            switch (t) {
              case 'd':
              case 'D':
              case 'DDD':
                return e + ' өдөр';
              default:
                return e;
            }
          },
        });
      })(n(1781));
    },
    1884: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '१', 2: '२', 3: '३', 4: '४', 5: '५', 6: '६', 7: '७', 8: '८', 9: '९', 0: '०' },
          n = { '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9', '०': '0' };
        function a(e, t, n, a) {
          var r = '';
          if (t)
            switch (n) {
              case 's':
                r = 'काही सेकंद';
                break;
              case 'ss':
                r = '%d सेकंद';
                break;
              case 'm':
                r = 'एक मिनिट';
                break;
              case 'mm':
                r = '%d मिनिटे';
                break;
              case 'h':
                r = 'एक तास';
                break;
              case 'hh':
                r = '%d तास';
                break;
              case 'd':
                r = 'एक दिवस';
                break;
              case 'dd':
                r = '%d दिवस';
                break;
              case 'M':
                r = 'एक महिना';
                break;
              case 'MM':
                r = '%d महिने';
                break;
              case 'y':
                r = 'एक वर्ष';
                break;
              case 'yy':
                r = '%d वर्षे';
            }
          else
            switch (n) {
              case 's':
                r = 'काही सेकंदां';
                break;
              case 'ss':
                r = '%d सेकंदां';
                break;
              case 'm':
                r = 'एका मिनिटा';
                break;
              case 'mm':
                r = '%d मिनिटां';
                break;
              case 'h':
                r = 'एका तासा';
                break;
              case 'hh':
                r = '%d तासां';
                break;
              case 'd':
                r = 'एका दिवसा';
                break;
              case 'dd':
                r = '%d दिवसां';
                break;
              case 'M':
                r = 'एका महिन्या';
                break;
              case 'MM':
                r = '%d महिन्यां';
                break;
              case 'y':
                r = 'एका वर्षा';
                break;
              case 'yy':
                r = '%d वर्षां';
            }
          return r.replace(/%d/i, e);
        }
        e.defineLocale('mr', {
          months: 'जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर'.split('_'),
          monthsShort: 'जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
          weekdaysShort: 'रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि'.split('_'),
          weekdaysMin: 'र_सो_मं_बु_गु_शु_श'.split('_'),
          longDateFormat: {
            LT: 'A h:mm वाजता',
            LTS: 'A h:mm:ss वाजता',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY, A h:mm वाजता',
            LLLL: 'dddd, D MMMM YYYY, A h:mm वाजता',
          },
          calendar: {
            sameDay: '[आज] LT',
            nextDay: '[उद्या] LT',
            nextWeek: 'dddd, LT',
            lastDay: '[काल] LT',
            lastWeek: '[मागील] dddd, LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%sमध्ये',
            past: '%sपूर्वी',
            s: a,
            ss: a,
            m: a,
            mm: a,
            h: a,
            hh: a,
            d: a,
            dd: a,
            M: a,
            MM: a,
            y: a,
            yy: a,
          },
          preparse: function (e) {
            return e.replace(/[१२३४५६७८९०]/g, function (e) {
              return n[e];
            });
          },
          postformat: function (e) {
            return e.replace(/\d/g, function (e) {
              return t[e];
            });
          },
          meridiemParse: /पहाटे|सकाळी|दुपारी|सायंकाळी|रात्री/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'पहाटे' === t || 'सकाळी' === t
                ? e
                : 'दुपारी' === t || 'सायंकाळी' === t || 'रात्री' === t
                ? e >= 12
                  ? e
                  : e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            return e >= 0 && e < 6 ? 'पहाटे' : e < 12 ? 'सकाळी' : e < 17 ? 'दुपारी' : e < 20 ? 'सायंकाळी' : 'रात्री';
          },
          week: { dow: 0, doy: 6 },
        });
      })(n(1781));
    },
    1885: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('ms', {
          months: 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
          monthsShort: 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
          weekdays: 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
          weekdaysShort: 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
          weekdaysMin: 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
          longDateFormat: {
            LT: 'HH.mm',
            LTS: 'HH.mm.ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY [pukul] HH.mm',
            LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm',
          },
          meridiemParse: /pagi|tengahari|petang|malam/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'pagi' === t
                ? e
                : 'tengahari' === t
                ? e >= 11
                  ? e
                  : e + 12
                : 'petang' === t || 'malam' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            return e < 11 ? 'pagi' : e < 15 ? 'tengahari' : e < 19 ? 'petang' : 'malam';
          },
          calendar: {
            sameDay: '[Hari ini pukul] LT',
            nextDay: '[Esok pukul] LT',
            nextWeek: 'dddd [pukul] LT',
            lastDay: '[Kelmarin pukul] LT',
            lastWeek: 'dddd [lepas pukul] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'dalam %s',
            past: '%s yang lepas',
            s: 'beberapa saat',
            ss: '%d saat',
            m: 'seminit',
            mm: '%d minit',
            h: 'sejam',
            hh: '%d jam',
            d: 'sehari',
            dd: '%d hari',
            M: 'sebulan',
            MM: '%d bulan',
            y: 'setahun',
            yy: '%d tahun',
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1886: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('ms-my', {
          months: 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
          monthsShort: 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
          weekdays: 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
          weekdaysShort: 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
          weekdaysMin: 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
          longDateFormat: {
            LT: 'HH.mm',
            LTS: 'HH.mm.ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY [pukul] HH.mm',
            LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm',
          },
          meridiemParse: /pagi|tengahari|petang|malam/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'pagi' === t
                ? e
                : 'tengahari' === t
                ? e >= 11
                  ? e
                  : e + 12
                : 'petang' === t || 'malam' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            return e < 11 ? 'pagi' : e < 15 ? 'tengahari' : e < 19 ? 'petang' : 'malam';
          },
          calendar: {
            sameDay: '[Hari ini pukul] LT',
            nextDay: '[Esok pukul] LT',
            nextWeek: 'dddd [pukul] LT',
            lastDay: '[Kelmarin pukul] LT',
            lastWeek: 'dddd [lepas pukul] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'dalam %s',
            past: '%s yang lepas',
            s: 'beberapa saat',
            ss: '%d saat',
            m: 'seminit',
            mm: '%d minit',
            h: 'sejam',
            hh: '%d jam',
            d: 'sehari',
            dd: '%d hari',
            M: 'sebulan',
            MM: '%d bulan',
            y: 'setahun',
            yy: '%d tahun',
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1887: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('mt', {
          months: 'Jannar_Frar_Marzu_April_Mejju_Ġunju_Lulju_Awwissu_Settembru_Ottubru_Novembru_Diċembru'.split('_'),
          monthsShort: 'Jan_Fra_Mar_Apr_Mej_Ġun_Lul_Aww_Set_Ott_Nov_Diċ'.split('_'),
          weekdays: 'Il-Ħadd_It-Tnejn_It-Tlieta_L-Erbgħa_Il-Ħamis_Il-Ġimgħa_Is-Sibt'.split('_'),
          weekdaysShort: 'Ħad_Tne_Tli_Erb_Ħam_Ġim_Sib'.split('_'),
          weekdaysMin: 'Ħa_Tn_Tl_Er_Ħa_Ġi_Si'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Illum fil-]LT',
            nextDay: '[Għada fil-]LT',
            nextWeek: 'dddd [fil-]LT',
            lastDay: '[Il-bieraħ fil-]LT',
            lastWeek: 'dddd [li għadda] [fil-]LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'f’ %s',
            past: '%s ilu',
            s: 'ftit sekondi',
            ss: '%d sekondi',
            m: 'minuta',
            mm: '%d minuti',
            h: 'siegħa',
            hh: '%d siegħat',
            d: 'ġurnata',
            dd: '%d ġranet',
            M: 'xahar',
            MM: '%d xhur',
            y: 'sena',
            yy: '%d sni',
          },
          dayOfMonthOrdinalParse: /\d{1,2}º/,
          ordinal: '%dº',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1888: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '၁', 2: '၂', 3: '၃', 4: '၄', 5: '၅', 6: '၆', 7: '၇', 8: '၈', 9: '၉', 0: '၀' },
          n = { '၁': '1', '၂': '2', '၃': '3', '၄': '4', '၅': '5', '၆': '6', '၇': '7', '၈': '8', '၉': '9', '၀': '0' };
        e.defineLocale('my', {
          months: 'ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ'.split('_'),
          monthsShort: 'ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ'.split('_'),
          weekdays: 'တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ'.split('_'),
          weekdaysShort: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),
          weekdaysMin: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[ယနေ.] LT [မှာ]',
            nextDay: '[မနက်ဖြန်] LT [မှာ]',
            nextWeek: 'dddd LT [မှာ]',
            lastDay: '[မနေ.က] LT [မှာ]',
            lastWeek: '[ပြီးခဲ့သော] dddd LT [မှာ]',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'လာမည့် %s မှာ',
            past: 'လွန်ခဲ့သော %s က',
            s: 'စက္ကန်.အနည်းငယ်',
            ss: '%d စက္ကန့်',
            m: 'တစ်မိနစ်',
            mm: '%d မိနစ်',
            h: 'တစ်နာရီ',
            hh: '%d နာရီ',
            d: 'တစ်ရက်',
            dd: '%d ရက်',
            M: 'တစ်လ',
            MM: '%d လ',
            y: 'တစ်နှစ်',
            yy: '%d နှစ်',
          },
          preparse: function (e) {
            return e.replace(/[၁၂၃၄၅၆၇၈၉၀]/g, function (e) {
              return n[e];
            });
          },
          postformat: function (e) {
            return e.replace(/\d/g, function (e) {
              return t[e];
            });
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1889: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('nb', {
          months: 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
          monthsShort: 'jan._feb._mars_apr._mai_juni_juli_aug._sep._okt._nov._des.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
          weekdaysShort: 'sø._ma._ti._on._to._fr._lø.'.split('_'),
          weekdaysMin: 'sø_ma_ti_on_to_fr_lø'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY [kl.] HH:mm',
            LLLL: 'dddd D. MMMM YYYY [kl.] HH:mm',
          },
          calendar: {
            sameDay: '[i dag kl.] LT',
            nextDay: '[i morgen kl.] LT',
            nextWeek: 'dddd [kl.] LT',
            lastDay: '[i går kl.] LT',
            lastWeek: '[forrige] dddd [kl.] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'om %s',
            past: '%s siden',
            s: 'noen sekunder',
            ss: '%d sekunder',
            m: 'ett minutt',
            mm: '%d minutter',
            h: 'en time',
            hh: '%d timer',
            d: 'en dag',
            dd: '%d dager',
            w: 'en uke',
            ww: '%d uker',
            M: 'en måned',
            MM: '%d måneder',
            y: 'ett år',
            yy: '%d år',
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1890: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '१', 2: '२', 3: '३', 4: '४', 5: '५', 6: '६', 7: '७', 8: '८', 9: '९', 0: '०' },
          n = { '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9', '०': '0' };
        e.defineLocale('ne', {
          months: 'जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर'.split('_'),
          monthsShort: 'जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार'.split('_'),
          weekdaysShort: 'आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.'.split('_'),
          weekdaysMin: 'आ._सो._मं._बु._बि._शु._श.'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'Aको h:mm बजे',
            LTS: 'Aको h:mm:ss बजे',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY, Aको h:mm बजे',
            LLLL: 'dddd, D MMMM YYYY, Aको h:mm बजे',
          },
          preparse: function (e) {
            return e.replace(/[१२३४५६७८९०]/g, function (e) {
              return n[e];
            });
          },
          postformat: function (e) {
            return e.replace(/\d/g, function (e) {
              return t[e];
            });
          },
          meridiemParse: /राति|बिहान|दिउँसो|साँझ/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'राति' === t
                ? e < 4
                  ? e
                  : e + 12
                : 'बिहान' === t
                ? e
                : 'दिउँसो' === t
                ? e >= 10
                  ? e
                  : e + 12
                : 'साँझ' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            return e < 3 ? 'राति' : e < 12 ? 'बिहान' : e < 16 ? 'दिउँसो' : e < 20 ? 'साँझ' : 'राति';
          },
          calendar: {
            sameDay: '[आज] LT',
            nextDay: '[भोलि] LT',
            nextWeek: '[आउँदो] dddd[,] LT',
            lastDay: '[हिजो] LT',
            lastWeek: '[गएको] dddd[,] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%sमा',
            past: '%s अगाडि',
            s: 'केही क्षण',
            ss: '%d सेकेण्ड',
            m: 'एक मिनेट',
            mm: '%d मिनेट',
            h: 'एक घण्टा',
            hh: '%d घण्टा',
            d: 'एक दिन',
            dd: '%d दिन',
            M: 'एक महिना',
            MM: '%d महिना',
            y: 'एक बर्ष',
            yy: '%d बर्ष',
          },
          week: { dow: 0, doy: 6 },
        });
      })(n(1781));
    },
    1891: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_'),
          n = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_'),
          a = [
            /^jan/i,
            /^feb/i,
            /^maart|mrt.?$/i,
            /^apr/i,
            /^mei$/i,
            /^jun[i.]?$/i,
            /^jul[i.]?$/i,
            /^aug/i,
            /^sep/i,
            /^okt/i,
            /^nov/i,
            /^dec/i,
          ],
          r =
            /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;
        e.defineLocale('nl', {
          months: 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
          monthsShort: function (e, a) {
            return e ? (/-MMM-/.test(a) ? n[e.month()] : t[e.month()]) : t;
          },
          monthsRegex: r,
          monthsShortRegex: r,
          monthsStrictRegex:
            /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december)/i,
          monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,
          monthsParse: a,
          longMonthsParse: a,
          shortMonthsParse: a,
          weekdays: 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
          weekdaysShort: 'zo._ma._di._wo._do._vr._za.'.split('_'),
          weekdaysMin: 'zo_ma_di_wo_do_vr_za'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD-MM-YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[vandaag om] LT',
            nextDay: '[morgen om] LT',
            nextWeek: 'dddd [om] LT',
            lastDay: '[gisteren om] LT',
            lastWeek: '[afgelopen] dddd [om] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'over %s',
            past: '%s geleden',
            s: 'een paar seconden',
            ss: '%d seconden',
            m: 'één minuut',
            mm: '%d minuten',
            h: 'één uur',
            hh: '%d uur',
            d: 'één dag',
            dd: '%d dagen',
            w: 'één week',
            ww: '%d weken',
            M: 'één maand',
            MM: '%d maanden',
            y: 'één jaar',
            yy: '%d jaar',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
          ordinal: function (e) {
            return e + (1 === e || 8 === e || e >= 20 ? 'ste' : 'de');
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1892: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_'),
          n = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_'),
          a = [
            /^jan/i,
            /^feb/i,
            /^maart|mrt.?$/i,
            /^apr/i,
            /^mei$/i,
            /^jun[i.]?$/i,
            /^jul[i.]?$/i,
            /^aug/i,
            /^sep/i,
            /^okt/i,
            /^nov/i,
            /^dec/i,
          ],
          r =
            /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;
        e.defineLocale('nl-be', {
          months: 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
          monthsShort: function (e, a) {
            return e ? (/-MMM-/.test(a) ? n[e.month()] : t[e.month()]) : t;
          },
          monthsRegex: r,
          monthsShortRegex: r,
          monthsStrictRegex:
            /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december)/i,
          monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,
          monthsParse: a,
          longMonthsParse: a,
          shortMonthsParse: a,
          weekdays: 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
          weekdaysShort: 'zo._ma._di._wo._do._vr._za.'.split('_'),
          weekdaysMin: 'zo_ma_di_wo_do_vr_za'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[vandaag om] LT',
            nextDay: '[morgen om] LT',
            nextWeek: 'dddd [om] LT',
            lastDay: '[gisteren om] LT',
            lastWeek: '[afgelopen] dddd [om] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'over %s',
            past: '%s geleden',
            s: 'een paar seconden',
            ss: '%d seconden',
            m: 'één minuut',
            mm: '%d minuten',
            h: 'één uur',
            hh: '%d uur',
            d: 'één dag',
            dd: '%d dagen',
            M: 'één maand',
            MM: '%d maanden',
            y: 'één jaar',
            yy: '%d jaar',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
          ordinal: function (e) {
            return e + (1 === e || 8 === e || e >= 20 ? 'ste' : 'de');
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1893: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('nn', {
          months: 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
          monthsShort: 'jan._feb._mars_apr._mai_juni_juli_aug._sep._okt._nov._des.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag'.split('_'),
          weekdaysShort: 'su._må._ty._on._to._fr._lau.'.split('_'),
          weekdaysMin: 'su_må_ty_on_to_fr_la'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY [kl.] H:mm',
            LLLL: 'dddd D. MMMM YYYY [kl.] HH:mm',
          },
          calendar: {
            sameDay: '[I dag klokka] LT',
            nextDay: '[I morgon klokka] LT',
            nextWeek: 'dddd [klokka] LT',
            lastDay: '[I går klokka] LT',
            lastWeek: '[Føregåande] dddd [klokka] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'om %s',
            past: '%s sidan',
            s: 'nokre sekund',
            ss: '%d sekund',
            m: 'eit minutt',
            mm: '%d minutt',
            h: 'ein time',
            hh: '%d timar',
            d: 'ein dag',
            dd: '%d dagar',
            w: 'ei veke',
            ww: '%d veker',
            M: 'ein månad',
            MM: '%d månader',
            y: 'eit år',
            yy: '%d år',
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1894: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('oc-lnc', {
          months: {
            standalone: 'genièr_febrièr_març_abril_mai_junh_julhet_agost_setembre_octòbre_novembre_decembre'.split('_'),
            format:
              "de genièr_de febrièr_de març_d'abril_de mai_de junh_de julhet_d'agost_de setembre_d'octòbre_de novembre_de decembre".split(
                '_',
              ),
            isFormat: /D[oD]?(\s)+MMMM/,
          },
          monthsShort: 'gen._febr._març_abr._mai_junh_julh._ago._set._oct._nov._dec.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'dimenge_diluns_dimars_dimècres_dijòus_divendres_dissabte'.split('_'),
          weekdaysShort: 'dg._dl._dm._dc._dj._dv._ds.'.split('_'),
          weekdaysMin: 'dg_dl_dm_dc_dj_dv_ds'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM [de] YYYY',
            ll: 'D MMM YYYY',
            LLL: 'D MMMM [de] YYYY [a] H:mm',
            lll: 'D MMM YYYY, H:mm',
            LLLL: 'dddd D MMMM [de] YYYY [a] H:mm',
            llll: 'ddd D MMM YYYY, H:mm',
          },
          calendar: {
            sameDay: '[uèi a] LT',
            nextDay: '[deman a] LT',
            nextWeek: 'dddd [a] LT',
            lastDay: '[ièr a] LT',
            lastWeek: 'dddd [passat a] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: "d'aquí %s",
            past: 'fa %s',
            s: 'unas segondas',
            ss: '%d segondas',
            m: 'una minuta',
            mm: '%d minutas',
            h: 'una ora',
            hh: '%d oras',
            d: 'un jorn',
            dd: '%d jorns',
            M: 'un mes',
            MM: '%d meses',
            y: 'un an',
            yy: '%d ans',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(r|n|t|è|a)/,
          ordinal: function (e, t) {
            var n = 1 === e ? 'r' : 2 === e ? 'n' : 3 === e ? 'r' : 4 === e ? 't' : 'è';
            return ('w' !== t && 'W' !== t) || (n = 'a'), e + n;
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1895: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '੧', 2: '੨', 3: '੩', 4: '੪', 5: '੫', 6: '੬', 7: '੭', 8: '੮', 9: '੯', 0: '੦' },
          n = { '੧': '1', '੨': '2', '੩': '3', '੪': '4', '੫': '5', '੬': '6', '੭': '7', '੮': '8', '੯': '9', '੦': '0' };
        e.defineLocale('pa-in', {
          months: 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split('_'),
          monthsShort: 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split('_'),
          weekdays: 'ਐਤਵਾਰ_ਸੋਮਵਾਰ_ਮੰਗਲਵਾਰ_ਬੁਧਵਾਰ_ਵੀਰਵਾਰ_ਸ਼ੁੱਕਰਵਾਰ_ਸ਼ਨੀਚਰਵਾਰ'.split('_'),
          weekdaysShort: 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
          weekdaysMin: 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
          longDateFormat: {
            LT: 'A h:mm ਵਜੇ',
            LTS: 'A h:mm:ss ਵਜੇ',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY, A h:mm ਵਜੇ',
            LLLL: 'dddd, D MMMM YYYY, A h:mm ਵਜੇ',
          },
          calendar: {
            sameDay: '[ਅਜ] LT',
            nextDay: '[ਕਲ] LT',
            nextWeek: '[ਅਗਲਾ] dddd, LT',
            lastDay: '[ਕਲ] LT',
            lastWeek: '[ਪਿਛਲੇ] dddd, LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s ਵਿੱਚ',
            past: '%s ਪਿਛਲੇ',
            s: 'ਕੁਝ ਸਕਿੰਟ',
            ss: '%d ਸਕਿੰਟ',
            m: 'ਇਕ ਮਿੰਟ',
            mm: '%d ਮਿੰਟ',
            h: 'ਇੱਕ ਘੰਟਾ',
            hh: '%d ਘੰਟੇ',
            d: 'ਇੱਕ ਦਿਨ',
            dd: '%d ਦਿਨ',
            M: 'ਇੱਕ ਮਹੀਨਾ',
            MM: '%d ਮਹੀਨੇ',
            y: 'ਇੱਕ ਸਾਲ',
            yy: '%d ਸਾਲ',
          },
          preparse: function (e) {
            return e.replace(/[੧੨੩੪੫੬੭੮੯੦]/g, function (e) {
              return n[e];
            });
          },
          postformat: function (e) {
            return e.replace(/\d/g, function (e) {
              return t[e];
            });
          },
          meridiemParse: /ਰਾਤ|ਸਵੇਰ|ਦੁਪਹਿਰ|ਸ਼ਾਮ/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'ਰਾਤ' === t
                ? e < 4
                  ? e
                  : e + 12
                : 'ਸਵੇਰ' === t
                ? e
                : 'ਦੁਪਹਿਰ' === t
                ? e >= 10
                  ? e
                  : e + 12
                : 'ਸ਼ਾਮ' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            return e < 4 ? 'ਰਾਤ' : e < 10 ? 'ਸਵੇਰ' : e < 17 ? 'ਦੁਪਹਿਰ' : e < 20 ? 'ਸ਼ਾਮ' : 'ਰਾਤ';
          },
          week: { dow: 0, doy: 6 },
        });
      })(n(1781));
    },
    1896: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t =
            'styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień'.split(
              '_',
            ),
          n =
            'stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia'.split(
              '_',
            ),
          a = [
            /^sty/i,
            /^lut/i,
            /^mar/i,
            /^kwi/i,
            /^maj/i,
            /^cze/i,
            /^lip/i,
            /^sie/i,
            /^wrz/i,
            /^paź/i,
            /^lis/i,
            /^gru/i,
          ];
        function r(e) {
          return e % 10 < 5 && e % 10 > 1 && ~~(e / 10) % 10 != 1;
        }
        function i(e, t, n) {
          var a = e + ' ';
          switch (n) {
            case 'ss':
              return a + (r(e) ? 'sekundy' : 'sekund');
            case 'm':
              return t ? 'minuta' : 'minutę';
            case 'mm':
              return a + (r(e) ? 'minuty' : 'minut');
            case 'h':
              return t ? 'godzina' : 'godzinę';
            case 'hh':
              return a + (r(e) ? 'godziny' : 'godzin');
            case 'ww':
              return a + (r(e) ? 'tygodnie' : 'tygodni');
            case 'MM':
              return a + (r(e) ? 'miesiące' : 'miesięcy');
            case 'yy':
              return a + (r(e) ? 'lata' : 'lat');
          }
        }
        e.defineLocale('pl', {
          months: function (e, a) {
            return e ? (/D MMMM/.test(a) ? n[e.month()] : t[e.month()]) : t;
          },
          monthsShort: 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
          monthsParse: a,
          longMonthsParse: a,
          shortMonthsParse: a,
          weekdays: 'niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota'.split('_'),
          weekdaysShort: 'ndz_pon_wt_śr_czw_pt_sob'.split('_'),
          weekdaysMin: 'Nd_Pn_Wt_Śr_Cz_Pt_So'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Dziś o] LT',
            nextDay: '[Jutro o] LT',
            nextWeek: function () {
              switch (this.day()) {
                case 0:
                  return '[W niedzielę o] LT';
                case 2:
                  return '[We wtorek o] LT';
                case 3:
                  return '[W środę o] LT';
                case 6:
                  return '[W sobotę o] LT';
                default:
                  return '[W] dddd [o] LT';
              }
            },
            lastDay: '[Wczoraj o] LT',
            lastWeek: function () {
              switch (this.day()) {
                case 0:
                  return '[W zeszłą niedzielę o] LT';
                case 3:
                  return '[W zeszłą środę o] LT';
                case 6:
                  return '[W zeszłą sobotę o] LT';
                default:
                  return '[W zeszły] dddd [o] LT';
              }
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'za %s',
            past: '%s temu',
            s: 'kilka sekund',
            ss: i,
            m: i,
            mm: i,
            h: i,
            hh: i,
            d: '1 dzień',
            dd: '%d dni',
            w: 'tydzień',
            ww: i,
            M: 'miesiąc',
            MM: i,
            y: 'rok',
            yy: i,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1897: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('pt', {
          months: 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
          monthsShort: 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
          weekdays: 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
          weekdaysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
          weekdaysMin: 'Do_2ª_3ª_4ª_5ª_6ª_Sá'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D [de] MMMM [de] YYYY',
            LLL: 'D [de] MMMM [de] YYYY HH:mm',
            LLLL: 'dddd, D [de] MMMM [de] YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Hoje às] LT',
            nextDay: '[Amanhã às] LT',
            nextWeek: 'dddd [às] LT',
            lastDay: '[Ontem às] LT',
            lastWeek: function () {
              return 0 === this.day() || 6 === this.day() ? '[Último] dddd [às] LT' : '[Última] dddd [às] LT';
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'em %s',
            past: 'há %s',
            s: 'segundos',
            ss: '%d segundos',
            m: 'um minuto',
            mm: '%d minutos',
            h: 'uma hora',
            hh: '%d horas',
            d: 'um dia',
            dd: '%d dias',
            w: 'uma semana',
            ww: '%d semanas',
            M: 'um mês',
            MM: '%d meses',
            y: 'um ano',
            yy: '%d anos',
          },
          dayOfMonthOrdinalParse: /\d{1,2}º/,
          ordinal: '%dº',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1898: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('pt-br', {
          months: 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
          monthsShort: 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
          weekdays: 'domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado'.split('_'),
          weekdaysShort: 'dom_seg_ter_qua_qui_sex_sáb'.split('_'),
          weekdaysMin: 'do_2ª_3ª_4ª_5ª_6ª_sá'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D [de] MMMM [de] YYYY',
            LLL: 'D [de] MMMM [de] YYYY [às] HH:mm',
            LLLL: 'dddd, D [de] MMMM [de] YYYY [às] HH:mm',
          },
          calendar: {
            sameDay: '[Hoje às] LT',
            nextDay: '[Amanhã às] LT',
            nextWeek: 'dddd [às] LT',
            lastDay: '[Ontem às] LT',
            lastWeek: function () {
              return 0 === this.day() || 6 === this.day() ? '[Último] dddd [às] LT' : '[Última] dddd [às] LT';
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'em %s',
            past: 'há %s',
            s: 'poucos segundos',
            ss: '%d segundos',
            m: 'um minuto',
            mm: '%d minutos',
            h: 'uma hora',
            hh: '%d horas',
            d: 'um dia',
            dd: '%d dias',
            M: 'um mês',
            MM: '%d meses',
            y: 'um ano',
            yy: '%d anos',
          },
          dayOfMonthOrdinalParse: /\d{1,2}º/,
          ordinal: '%dº',
          invalidDate: 'Data inválida',
        });
      })(n(1781));
    },
    1899: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n) {
          var a = ' ';
          return (
            (e % 100 >= 20 || (e >= 100 && e % 100 == 0)) && (a = ' de '),
            e + a + { ss: 'secunde', mm: 'minute', hh: 'ore', dd: 'zile', ww: 'săptămâni', MM: 'luni', yy: 'ani' }[n]
          );
        }
        e.defineLocale('ro', {
          months:
            'ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie'.split(
              '_',
            ),
          monthsShort: 'ian._feb._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'duminică_luni_marți_miercuri_joi_vineri_sâmbătă'.split('_'),
          weekdaysShort: 'Dum_Lun_Mar_Mie_Joi_Vin_Sâm'.split('_'),
          weekdaysMin: 'Du_Lu_Ma_Mi_Jo_Vi_Sâ'.split('_'),
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY H:mm',
            LLLL: 'dddd, D MMMM YYYY H:mm',
          },
          calendar: {
            sameDay: '[azi la] LT',
            nextDay: '[mâine la] LT',
            nextWeek: 'dddd [la] LT',
            lastDay: '[ieri la] LT',
            lastWeek: '[fosta] dddd [la] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'peste %s',
            past: '%s în urmă',
            s: 'câteva secunde',
            ss: t,
            m: 'un minut',
            mm: t,
            h: 'o oră',
            hh: t,
            d: 'o zi',
            dd: t,
            w: 'o săptămână',
            ww: t,
            M: 'o lună',
            MM: t,
            y: 'un an',
            yy: t,
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1900: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n) {
          var a, r;
          return 'm' === n
            ? t
              ? 'минута'
              : 'минуту'
            : e +
                ' ' +
                ((a = +e),
                (r = {
                  ss: t ? 'секунда_секунды_секунд' : 'секунду_секунды_секунд',
                  mm: t ? 'минута_минуты_минут' : 'минуту_минуты_минут',
                  hh: 'час_часа_часов',
                  dd: 'день_дня_дней',
                  ww: 'неделя_недели_недель',
                  MM: 'месяц_месяца_месяцев',
                  yy: 'год_года_лет',
                }[n].split('_')),
                a % 10 == 1 && a % 100 != 11
                  ? r[0]
                  : a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 10 || a % 100 >= 20)
                  ? r[1]
                  : r[2]);
        }
        var n = [
          /^янв/i,
          /^фев/i,
          /^мар/i,
          /^апр/i,
          /^ма[йя]/i,
          /^июн/i,
          /^июл/i,
          /^авг/i,
          /^сен/i,
          /^окт/i,
          /^ноя/i,
          /^дек/i,
        ];
        e.defineLocale('ru', {
          months: {
            format: 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_'),
            standalone: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
          },
          monthsShort: {
            format: 'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'.split('_'),
            standalone: 'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split('_'),
          },
          weekdays: {
            standalone: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
            format: 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_'),
            isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?] ?dddd/,
          },
          weekdaysShort: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
          weekdaysMin: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
          monthsParse: n,
          longMonthsParse: n,
          shortMonthsParse: n,
          monthsRegex:
            /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,
          monthsShortRegex:
            /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,
          monthsStrictRegex:
            /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,
          monthsShortStrictRegex:
            /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY г.',
            LLL: 'D MMMM YYYY г., H:mm',
            LLLL: 'dddd, D MMMM YYYY г., H:mm',
          },
          calendar: {
            sameDay: '[Сегодня, в] LT',
            nextDay: '[Завтра, в] LT',
            lastDay: '[Вчера, в] LT',
            nextWeek: function (e) {
              if (e.week() === this.week()) return 2 === this.day() ? '[Во] dddd, [в] LT' : '[В] dddd, [в] LT';
              switch (this.day()) {
                case 0:
                  return '[В следующее] dddd, [в] LT';
                case 1:
                case 2:
                case 4:
                  return '[В следующий] dddd, [в] LT';
                case 3:
                case 5:
                case 6:
                  return '[В следующую] dddd, [в] LT';
              }
            },
            lastWeek: function (e) {
              if (e.week() === this.week()) return 2 === this.day() ? '[Во] dddd, [в] LT' : '[В] dddd, [в] LT';
              switch (this.day()) {
                case 0:
                  return '[В прошлое] dddd, [в] LT';
                case 1:
                case 2:
                case 4:
                  return '[В прошлый] dddd, [в] LT';
                case 3:
                case 5:
                case 6:
                  return '[В прошлую] dddd, [в] LT';
              }
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'через %s',
            past: '%s назад',
            s: 'несколько секунд',
            ss: t,
            m: t,
            mm: t,
            h: 'час',
            hh: t,
            d: 'день',
            dd: t,
            w: 'неделя',
            ww: t,
            M: 'месяц',
            MM: t,
            y: 'год',
            yy: t,
          },
          meridiemParse: /ночи|утра|дня|вечера/i,
          isPM: function (e) {
            return /^(дня|вечера)$/.test(e);
          },
          meridiem: function (e, t, n) {
            return e < 4 ? 'ночи' : e < 12 ? 'утра' : e < 17 ? 'дня' : 'вечера';
          },
          dayOfMonthOrdinalParse: /\d{1,2}-(й|го|я)/,
          ordinal: function (e, t) {
            switch (t) {
              case 'M':
              case 'd':
              case 'DDD':
                return e + '-й';
              case 'D':
                return e + '-го';
              case 'w':
              case 'W':
                return e + '-я';
              default:
                return e;
            }
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1901: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = [
            'جنوري',
            'فيبروري',
            'مارچ',
            'اپريل',
            'مئي',
            'جون',
            'جولاءِ',
            'آگسٽ',
            'سيپٽمبر',
            'آڪٽوبر',
            'نومبر',
            'ڊسمبر',
          ],
          n = ['آچر', 'سومر', 'اڱارو', 'اربع', 'خميس', 'جمع', 'ڇنڇر'];
        e.defineLocale('sd', {
          months: t,
          monthsShort: t,
          weekdays: n,
          weekdaysShort: n,
          weekdaysMin: n,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd، D MMMM YYYY HH:mm',
          },
          meridiemParse: /صبح|شام/,
          isPM: function (e) {
            return 'شام' === e;
          },
          meridiem: function (e, t, n) {
            return e < 12 ? 'صبح' : 'شام';
          },
          calendar: {
            sameDay: '[اڄ] LT',
            nextDay: '[سڀاڻي] LT',
            nextWeek: 'dddd [اڳين هفتي تي] LT',
            lastDay: '[ڪالهه] LT',
            lastWeek: '[گزريل هفتي] dddd [تي] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s پوء',
            past: '%s اڳ',
            s: 'چند سيڪنڊ',
            ss: '%d سيڪنڊ',
            m: 'هڪ منٽ',
            mm: '%d منٽ',
            h: 'هڪ ڪلاڪ',
            hh: '%d ڪلاڪ',
            d: 'هڪ ڏينهن',
            dd: '%d ڏينهن',
            M: 'هڪ مهينو',
            MM: '%d مهينا',
            y: 'هڪ سال',
            yy: '%d سال',
          },
          preparse: function (e) {
            return e.replace(/،/g, ',');
          },
          postformat: function (e) {
            return e.replace(/,/g, '،');
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1902: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('se', {
          months:
            'ođđajagemánnu_guovvamánnu_njukčamánnu_cuoŋománnu_miessemánnu_geassemánnu_suoidnemánnu_borgemánnu_čakčamánnu_golggotmánnu_skábmamánnu_juovlamánnu'.split(
              '_',
            ),
          monthsShort: 'ođđj_guov_njuk_cuo_mies_geas_suoi_borg_čakč_golg_skáb_juov'.split('_'),
          weekdays: 'sotnabeaivi_vuossárga_maŋŋebárga_gaskavahkku_duorastat_bearjadat_lávvardat'.split('_'),
          weekdaysShort: 'sotn_vuos_maŋ_gask_duor_bear_láv'.split('_'),
          weekdaysMin: 's_v_m_g_d_b_L'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'MMMM D. [b.] YYYY',
            LLL: 'MMMM D. [b.] YYYY [ti.] HH:mm',
            LLLL: 'dddd, MMMM D. [b.] YYYY [ti.] HH:mm',
          },
          calendar: {
            sameDay: '[otne ti] LT',
            nextDay: '[ihttin ti] LT',
            nextWeek: 'dddd [ti] LT',
            lastDay: '[ikte ti] LT',
            lastWeek: '[ovddit] dddd [ti] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s geažes',
            past: 'maŋit %s',
            s: 'moadde sekunddat',
            ss: '%d sekunddat',
            m: 'okta minuhta',
            mm: '%d minuhtat',
            h: 'okta diimmu',
            hh: '%d diimmut',
            d: 'okta beaivi',
            dd: '%d beaivvit',
            M: 'okta mánnu',
            MM: '%d mánut',
            y: 'okta jahki',
            yy: '%d jagit',
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1903: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('si', {
          months:
            'ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්'.split(
              '_',
            ),
          monthsShort: 'ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ'.split('_'),
          weekdays: 'ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා'.split('_'),
          weekdaysShort: 'ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන'.split('_'),
          weekdaysMin: 'ඉ_ස_අ_බ_බ්‍ර_සි_සෙ'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'a h:mm',
            LTS: 'a h:mm:ss',
            L: 'YYYY/MM/DD',
            LL: 'YYYY MMMM D',
            LLL: 'YYYY MMMM D, a h:mm',
            LLLL: 'YYYY MMMM D [වැනි] dddd, a h:mm:ss',
          },
          calendar: {
            sameDay: '[අද] LT[ට]',
            nextDay: '[හෙට] LT[ට]',
            nextWeek: 'dddd LT[ට]',
            lastDay: '[ඊයේ] LT[ට]',
            lastWeek: '[පසුගිය] dddd LT[ට]',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%sකින්',
            past: '%sකට පෙර',
            s: 'තත්පර කිහිපය',
            ss: 'තත්පර %d',
            m: 'මිනිත්තුව',
            mm: 'මිනිත්තු %d',
            h: 'පැය',
            hh: 'පැය %d',
            d: 'දිනය',
            dd: 'දින %d',
            M: 'මාසය',
            MM: 'මාස %d',
            y: 'වසර',
            yy: 'වසර %d',
          },
          dayOfMonthOrdinalParse: /\d{1,2} වැනි/,
          ordinal: function (e) {
            return e + ' වැනි';
          },
          meridiemParse: /පෙර වරු|පස් වරු|පෙ.ව|ප.ව./,
          isPM: function (e) {
            return 'ප.ව.' === e || 'පස් වරු' === e;
          },
          meridiem: function (e, t, n) {
            return e > 11 ? (n ? 'ප.ව.' : 'පස් වරු') : n ? 'පෙ.ව.' : 'පෙර වරු';
          },
        });
      })(n(1781));
    },
    1904: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = 'január_február_marec_apríl_máj_jún_júl_august_september_október_november_december'.split('_'),
          n = 'jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec'.split('_');
        function a(e) {
          return e > 1 && e < 5;
        }
        function r(e, t, n, r) {
          var i = e + ' ';
          switch (n) {
            case 's':
              return t || r ? 'pár sekúnd' : 'pár sekundami';
            case 'ss':
              return t || r ? i + (a(e) ? 'sekundy' : 'sekúnd') : i + 'sekundami';
            case 'm':
              return t ? 'minúta' : r ? 'minútu' : 'minútou';
            case 'mm':
              return t || r ? i + (a(e) ? 'minúty' : 'minút') : i + 'minútami';
            case 'h':
              return t ? 'hodina' : r ? 'hodinu' : 'hodinou';
            case 'hh':
              return t || r ? i + (a(e) ? 'hodiny' : 'hodín') : i + 'hodinami';
            case 'd':
              return t || r ? 'deň' : 'dňom';
            case 'dd':
              return t || r ? i + (a(e) ? 'dni' : 'dní') : i + 'dňami';
            case 'M':
              return t || r ? 'mesiac' : 'mesiacom';
            case 'MM':
              return t || r ? i + (a(e) ? 'mesiace' : 'mesiacov') : i + 'mesiacmi';
            case 'y':
              return t || r ? 'rok' : 'rokom';
            case 'yy':
              return t || r ? i + (a(e) ? 'roky' : 'rokov') : i + 'rokmi';
          }
        }
        e.defineLocale('sk', {
          months: t,
          monthsShort: n,
          weekdays: 'nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota'.split('_'),
          weekdaysShort: 'ne_po_ut_st_št_pi_so'.split('_'),
          weekdaysMin: 'ne_po_ut_st_št_pi_so'.split('_'),
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY H:mm',
            LLLL: 'dddd D. MMMM YYYY H:mm',
          },
          calendar: {
            sameDay: '[dnes o] LT',
            nextDay: '[zajtra o] LT',
            nextWeek: function () {
              switch (this.day()) {
                case 0:
                  return '[v nedeľu o] LT';
                case 1:
                case 2:
                  return '[v] dddd [o] LT';
                case 3:
                  return '[v stredu o] LT';
                case 4:
                  return '[vo štvrtok o] LT';
                case 5:
                  return '[v piatok o] LT';
                case 6:
                  return '[v sobotu o] LT';
              }
            },
            lastDay: '[včera o] LT',
            lastWeek: function () {
              switch (this.day()) {
                case 0:
                  return '[minulú nedeľu o] LT';
                case 1:
                case 2:
                  return '[minulý] dddd [o] LT';
                case 3:
                  return '[minulú stredu o] LT';
                case 4:
                case 5:
                  return '[minulý] dddd [o] LT';
                case 6:
                  return '[minulú sobotu o] LT';
              }
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'za %s',
            past: 'pred %s',
            s: r,
            ss: r,
            m: r,
            mm: r,
            h: r,
            hh: r,
            d: r,
            dd: r,
            M: r,
            MM: r,
            y: r,
            yy: r,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1905: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n, a) {
          var r = e + ' ';
          switch (n) {
            case 's':
              return t || a ? 'nekaj sekund' : 'nekaj sekundami';
            case 'ss':
              return (r +=
                1 === e
                  ? t
                    ? 'sekundo'
                    : 'sekundi'
                  : 2 === e
                  ? t || a
                    ? 'sekundi'
                    : 'sekundah'
                  : e < 5
                  ? t || a
                    ? 'sekunde'
                    : 'sekundah'
                  : 'sekund');
            case 'm':
              return t ? 'ena minuta' : 'eno minuto';
            case 'mm':
              return (r +=
                1 === e
                  ? t
                    ? 'minuta'
                    : 'minuto'
                  : 2 === e
                  ? t || a
                    ? 'minuti'
                    : 'minutama'
                  : e < 5
                  ? t || a
                    ? 'minute'
                    : 'minutami'
                  : t || a
                  ? 'minut'
                  : 'minutami');
            case 'h':
              return t ? 'ena ura' : 'eno uro';
            case 'hh':
              return (r +=
                1 === e
                  ? t
                    ? 'ura'
                    : 'uro'
                  : 2 === e
                  ? t || a
                    ? 'uri'
                    : 'urama'
                  : e < 5
                  ? t || a
                    ? 'ure'
                    : 'urami'
                  : t || a
                  ? 'ur'
                  : 'urami');
            case 'd':
              return t || a ? 'en dan' : 'enim dnem';
            case 'dd':
              return (r +=
                1 === e
                  ? t || a
                    ? 'dan'
                    : 'dnem'
                  : 2 === e
                  ? t || a
                    ? 'dni'
                    : 'dnevoma'
                  : t || a
                  ? 'dni'
                  : 'dnevi');
            case 'M':
              return t || a ? 'en mesec' : 'enim mesecem';
            case 'MM':
              return (r +=
                1 === e
                  ? t || a
                    ? 'mesec'
                    : 'mesecem'
                  : 2 === e
                  ? t || a
                    ? 'meseca'
                    : 'mesecema'
                  : e < 5
                  ? t || a
                    ? 'mesece'
                    : 'meseci'
                  : t || a
                  ? 'mesecev'
                  : 'meseci');
            case 'y':
              return t || a ? 'eno leto' : 'enim letom';
            case 'yy':
              return (r +=
                1 === e
                  ? t || a
                    ? 'leto'
                    : 'letom'
                  : 2 === e
                  ? t || a
                    ? 'leti'
                    : 'letoma'
                  : e < 5
                  ? t || a
                    ? 'leta'
                    : 'leti'
                  : t || a
                  ? 'let'
                  : 'leti');
          }
        }
        e.defineLocale('sl', {
          months: 'januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december'.split('_'),
          monthsShort: 'jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota'.split('_'),
          weekdaysShort: 'ned._pon._tor._sre._čet._pet._sob.'.split('_'),
          weekdaysMin: 'ne_po_to_sr_če_pe_so'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD. MM. YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY H:mm',
            LLLL: 'dddd, D. MMMM YYYY H:mm',
          },
          calendar: {
            sameDay: '[danes ob] LT',
            nextDay: '[jutri ob] LT',
            nextWeek: function () {
              switch (this.day()) {
                case 0:
                  return '[v] [nedeljo] [ob] LT';
                case 3:
                  return '[v] [sredo] [ob] LT';
                case 6:
                  return '[v] [soboto] [ob] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                  return '[v] dddd [ob] LT';
              }
            },
            lastDay: '[včeraj ob] LT',
            lastWeek: function () {
              switch (this.day()) {
                case 0:
                  return '[prejšnjo] [nedeljo] [ob] LT';
                case 3:
                  return '[prejšnjo] [sredo] [ob] LT';
                case 6:
                  return '[prejšnjo] [soboto] [ob] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                  return '[prejšnji] dddd [ob] LT';
              }
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'čez %s',
            past: 'pred %s',
            s: t,
            ss: t,
            m: t,
            mm: t,
            h: t,
            hh: t,
            d: t,
            dd: t,
            M: t,
            MM: t,
            y: t,
            yy: t,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1906: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('sq', {
          months: 'Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor'.split('_'),
          monthsShort: 'Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj'.split('_'),
          weekdays: 'E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë'.split('_'),
          weekdaysShort: 'Die_Hën_Mar_Mër_Enj_Pre_Sht'.split('_'),
          weekdaysMin: 'D_H_Ma_Më_E_P_Sh'.split('_'),
          weekdaysParseExact: !0,
          meridiemParse: /PD|MD/,
          isPM: function (e) {
            return 'M' === e.charAt(0);
          },
          meridiem: function (e, t, n) {
            return e < 12 ? 'PD' : 'MD';
          },
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Sot në] LT',
            nextDay: '[Nesër në] LT',
            nextWeek: 'dddd [në] LT',
            lastDay: '[Dje në] LT',
            lastWeek: 'dddd [e kaluar në] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'në %s',
            past: '%s më parë',
            s: 'disa sekonda',
            ss: '%d sekonda',
            m: 'një minutë',
            mm: '%d minuta',
            h: 'një orë',
            hh: '%d orë',
            d: 'një ditë',
            dd: '%d ditë',
            M: 'një muaj',
            MM: '%d muaj',
            y: 'një vit',
            yy: '%d vite',
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1907: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = {
          words: {
            ss: ['sekunda', 'sekunde', 'sekundi'],
            m: ['jedan minut', 'jedne minute'],
            mm: ['minut', 'minute', 'minuta'],
            h: ['jedan sat', 'jednog sata'],
            hh: ['sat', 'sata', 'sati'],
            dd: ['dan', 'dana', 'dana'],
            MM: ['mesec', 'meseca', 'meseci'],
            yy: ['godina', 'godine', 'godina'],
          },
          correctGrammaticalCase: function (e, t) {
            return 1 === e ? t[0] : e >= 2 && e <= 4 ? t[1] : t[2];
          },
          translate: function (e, n, a) {
            var r = t.words[a];
            return 1 === a.length ? (n ? r[0] : r[1]) : e + ' ' + t.correctGrammaticalCase(e, r);
          },
        };
        e.defineLocale('sr', {
          months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
          monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota'.split('_'),
          weekdaysShort: 'ned._pon._uto._sre._čet._pet._sub.'.split('_'),
          weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'D. M. YYYY.',
            LL: 'D. MMMM YYYY.',
            LLL: 'D. MMMM YYYY. H:mm',
            LLLL: 'dddd, D. MMMM YYYY. H:mm',
          },
          calendar: {
            sameDay: '[danas u] LT',
            nextDay: '[sutra u] LT',
            nextWeek: function () {
              switch (this.day()) {
                case 0:
                  return '[u] [nedelju] [u] LT';
                case 3:
                  return '[u] [sredu] [u] LT';
                case 6:
                  return '[u] [subotu] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                  return '[u] dddd [u] LT';
              }
            },
            lastDay: '[juče u] LT',
            lastWeek: function () {
              return [
                '[prošle] [nedelje] [u] LT',
                '[prošlog] [ponedeljka] [u] LT',
                '[prošlog] [utorka] [u] LT',
                '[prošle] [srede] [u] LT',
                '[prošlog] [četvrtka] [u] LT',
                '[prošlog] [petka] [u] LT',
                '[prošle] [subote] [u] LT',
              ][this.day()];
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'za %s',
            past: 'pre %s',
            s: 'nekoliko sekundi',
            ss: t.translate,
            m: t.translate,
            mm: t.translate,
            h: t.translate,
            hh: t.translate,
            d: 'dan',
            dd: t.translate,
            M: 'mesec',
            MM: t.translate,
            y: 'godinu',
            yy: t.translate,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1908: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = {
          words: {
            ss: ['секунда', 'секунде', 'секунди'],
            m: ['један минут', 'једне минуте'],
            mm: ['минут', 'минуте', 'минута'],
            h: ['један сат', 'једног сата'],
            hh: ['сат', 'сата', 'сати'],
            dd: ['дан', 'дана', 'дана'],
            MM: ['месец', 'месеца', 'месеци'],
            yy: ['година', 'године', 'година'],
          },
          correctGrammaticalCase: function (e, t) {
            return 1 === e ? t[0] : e >= 2 && e <= 4 ? t[1] : t[2];
          },
          translate: function (e, n, a) {
            var r = t.words[a];
            return 1 === a.length ? (n ? r[0] : r[1]) : e + ' ' + t.correctGrammaticalCase(e, r);
          },
        };
        e.defineLocale('sr-cyrl', {
          months: 'јануар_фебруар_март_април_мај_јун_јул_август_септембар_октобар_новембар_децембар'.split('_'),
          monthsShort: 'јан._феб._мар._апр._мај_јун_јул_авг._сеп._окт._нов._дец.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'недеља_понедељак_уторак_среда_четвртак_петак_субота'.split('_'),
          weekdaysShort: 'нед._пон._уто._сре._чет._пет._суб.'.split('_'),
          weekdaysMin: 'не_по_ут_ср_че_пе_су'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'D. M. YYYY.',
            LL: 'D. MMMM YYYY.',
            LLL: 'D. MMMM YYYY. H:mm',
            LLLL: 'dddd, D. MMMM YYYY. H:mm',
          },
          calendar: {
            sameDay: '[данас у] LT',
            nextDay: '[сутра у] LT',
            nextWeek: function () {
              switch (this.day()) {
                case 0:
                  return '[у] [недељу] [у] LT';
                case 3:
                  return '[у] [среду] [у] LT';
                case 6:
                  return '[у] [суботу] [у] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                  return '[у] dddd [у] LT';
              }
            },
            lastDay: '[јуче у] LT',
            lastWeek: function () {
              return [
                '[прошле] [недеље] [у] LT',
                '[прошлог] [понедељка] [у] LT',
                '[прошлог] [уторка] [у] LT',
                '[прошле] [среде] [у] LT',
                '[прошлог] [четвртка] [у] LT',
                '[прошлог] [петка] [у] LT',
                '[прошле] [суботе] [у] LT',
              ][this.day()];
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'за %s',
            past: 'пре %s',
            s: 'неколико секунди',
            ss: t.translate,
            m: t.translate,
            mm: t.translate,
            h: t.translate,
            hh: t.translate,
            d: 'дан',
            dd: t.translate,
            M: 'месец',
            MM: t.translate,
            y: 'годину',
            yy: t.translate,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1909: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('ss', {
          months:
            "Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split(
              '_',
            ),
          monthsShort: 'Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo'.split('_'),
          weekdays: 'Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo'.split('_'),
          weekdaysShort: 'Lis_Umb_Lsb_Les_Lsi_Lsh_Umg'.split('_'),
          weekdaysMin: 'Li_Us_Lb_Lt_Ls_Lh_Ug'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'h:mm A',
            LTS: 'h:mm:ss A',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY h:mm A',
            LLLL: 'dddd, D MMMM YYYY h:mm A',
          },
          calendar: {
            sameDay: '[Namuhla nga] LT',
            nextDay: '[Kusasa nga] LT',
            nextWeek: 'dddd [nga] LT',
            lastDay: '[Itolo nga] LT',
            lastWeek: 'dddd [leliphelile] [nga] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'nga %s',
            past: 'wenteka nga %s',
            s: 'emizuzwana lomcane',
            ss: '%d mzuzwana',
            m: 'umzuzu',
            mm: '%d emizuzu',
            h: 'lihora',
            hh: '%d emahora',
            d: 'lilanga',
            dd: '%d emalanga',
            M: 'inyanga',
            MM: '%d tinyanga',
            y: 'umnyaka',
            yy: '%d iminyaka',
          },
          meridiemParse: /ekuseni|emini|entsambama|ebusuku/,
          meridiem: function (e, t, n) {
            return e < 11 ? 'ekuseni' : e < 15 ? 'emini' : e < 19 ? 'entsambama' : 'ebusuku';
          },
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'ekuseni' === t
                ? e
                : 'emini' === t
                ? e >= 11
                  ? e
                  : e + 12
                : 'entsambama' === t || 'ebusuku' === t
                ? 0 === e
                  ? 0
                  : e + 12
                : void 0
            );
          },
          dayOfMonthOrdinalParse: /\d{1,2}/,
          ordinal: '%d',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1910: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('sv', {
          months: 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split('_'),
          monthsShort: 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
          weekdays: 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag'.split('_'),
          weekdaysShort: 'sön_mån_tis_ons_tor_fre_lör'.split('_'),
          weekdaysMin: 'sö_må_ti_on_to_fr_lö'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'YYYY-MM-DD',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY [kl.] HH:mm',
            LLLL: 'dddd D MMMM YYYY [kl.] HH:mm',
            lll: 'D MMM YYYY HH:mm',
            llll: 'ddd D MMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Idag] LT',
            nextDay: '[Imorgon] LT',
            lastDay: '[Igår] LT',
            nextWeek: '[På] dddd LT',
            lastWeek: '[I] dddd[s] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'om %s',
            past: 'för %s sedan',
            s: 'några sekunder',
            ss: '%d sekunder',
            m: 'en minut',
            mm: '%d minuter',
            h: 'en timme',
            hh: '%d timmar',
            d: 'en dag',
            dd: '%d dagar',
            M: 'en månad',
            MM: '%d månader',
            y: 'ett år',
            yy: '%d år',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(\:e|\:a)/,
          ordinal: function (e) {
            var t = e % 10;
            return e + (1 == ~~((e % 100) / 10) ? ':e' : 1 === t || 2 === t ? ':a' : ':e');
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1911: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('sw', {
          months: 'Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba'.split('_'),
          monthsShort: 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des'.split('_'),
          weekdays: 'Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi'.split('_'),
          weekdaysShort: 'Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos'.split('_'),
          weekdaysMin: 'J2_J3_J4_J5_Al_Ij_J1'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'hh:mm A',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[leo saa] LT',
            nextDay: '[kesho saa] LT',
            nextWeek: '[wiki ijayo] dddd [saat] LT',
            lastDay: '[jana] LT',
            lastWeek: '[wiki iliyopita] dddd [saat] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s baadaye',
            past: 'tokea %s',
            s: 'hivi punde',
            ss: 'sekunde %d',
            m: 'dakika moja',
            mm: 'dakika %d',
            h: 'saa limoja',
            hh: 'masaa %d',
            d: 'siku moja',
            dd: 'siku %d',
            M: 'mwezi mmoja',
            MM: 'miezi %d',
            y: 'mwaka mmoja',
            yy: 'miaka %d',
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1912: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = { 1: '௧', 2: '௨', 3: '௩', 4: '௪', 5: '௫', 6: '௬', 7: '௭', 8: '௮', 9: '௯', 0: '௦' },
          n = { '௧': '1', '௨': '2', '௩': '3', '௪': '4', '௫': '5', '௬': '6', '௭': '7', '௮': '8', '௯': '9', '௦': '0' };
        e.defineLocale('ta', {
          months: 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
          monthsShort: 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split(
            '_',
          ),
          weekdays: 'ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை'.split(
            '_',
          ),
          weekdaysShort: 'ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி'.split('_'),
          weekdaysMin: 'ஞா_தி_செ_பு_வி_வெ_ச'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY, HH:mm',
            LLLL: 'dddd, D MMMM YYYY, HH:mm',
          },
          calendar: {
            sameDay: '[இன்று] LT',
            nextDay: '[நாளை] LT',
            nextWeek: 'dddd, LT',
            lastDay: '[நேற்று] LT',
            lastWeek: '[கடந்த வாரம்] dddd, LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s இல்',
            past: '%s முன்',
            s: 'ஒரு சில விநாடிகள்',
            ss: '%d விநாடிகள்',
            m: 'ஒரு நிமிடம்',
            mm: '%d நிமிடங்கள்',
            h: 'ஒரு மணி நேரம்',
            hh: '%d மணி நேரம்',
            d: 'ஒரு நாள்',
            dd: '%d நாட்கள்',
            M: 'ஒரு மாதம்',
            MM: '%d மாதங்கள்',
            y: 'ஒரு வருடம்',
            yy: '%d ஆண்டுகள்',
          },
          dayOfMonthOrdinalParse: /\d{1,2}வது/,
          ordinal: function (e) {
            return e + 'வது';
          },
          preparse: function (e) {
            return e.replace(/[௧௨௩௪௫௬௭௮௯௦]/g, function (e) {
              return n[e];
            });
          },
          postformat: function (e) {
            return e.replace(/\d/g, function (e) {
              return t[e];
            });
          },
          meridiemParse: /யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,
          meridiem: function (e, t, n) {
            return e < 2
              ? ' யாமம்'
              : e < 6
              ? ' வைகறை'
              : e < 10
              ? ' காலை'
              : e < 14
              ? ' நண்பகல்'
              : e < 18
              ? ' எற்பாடு'
              : e < 22
              ? ' மாலை'
              : ' யாமம்';
          },
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'யாமம்' === t
                ? e < 2
                  ? e
                  : e + 12
                : 'வைகறை' === t || 'காலை' === t || ('நண்பகல்' === t && e >= 10)
                ? e
                : e + 12
            );
          },
          week: { dow: 0, doy: 6 },
        });
      })(n(1781));
    },
    1913: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('te', {
          months: 'జనవరి_ఫిబ్రవరి_మార్చి_ఏప్రిల్_మే_జూన్_జులై_ఆగస్టు_సెప్టెంబర్_అక్టోబర్_నవంబర్_డిసెంబర్'.split('_'),
          monthsShort: 'జన._ఫిబ్ర._మార్చి_ఏప్రి._మే_జూన్_జులై_ఆగ._సెప్._అక్టో._నవ._డిసె.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'ఆదివారం_సోమవారం_మంగళవారం_బుధవారం_గురువారం_శుక్రవారం_శనివారం'.split('_'),
          weekdaysShort: 'ఆది_సోమ_మంగళ_బుధ_గురు_శుక్ర_శని'.split('_'),
          weekdaysMin: 'ఆ_సో_మం_బు_గు_శు_శ'.split('_'),
          longDateFormat: {
            LT: 'A h:mm',
            LTS: 'A h:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY, A h:mm',
            LLLL: 'dddd, D MMMM YYYY, A h:mm',
          },
          calendar: {
            sameDay: '[నేడు] LT',
            nextDay: '[రేపు] LT',
            nextWeek: 'dddd, LT',
            lastDay: '[నిన్న] LT',
            lastWeek: '[గత] dddd, LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s లో',
            past: '%s క్రితం',
            s: 'కొన్ని క్షణాలు',
            ss: '%d సెకన్లు',
            m: 'ఒక నిమిషం',
            mm: '%d నిమిషాలు',
            h: 'ఒక గంట',
            hh: '%d గంటలు',
            d: 'ఒక రోజు',
            dd: '%d రోజులు',
            M: 'ఒక నెల',
            MM: '%d నెలలు',
            y: 'ఒక సంవత్సరం',
            yy: '%d సంవత్సరాలు',
          },
          dayOfMonthOrdinalParse: /\d{1,2}వ/,
          ordinal: '%dవ',
          meridiemParse: /రాత్రి|ఉదయం|మధ్యాహ్నం|సాయంత్రం/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'రాత్రి' === t
                ? e < 4
                  ? e
                  : e + 12
                : 'ఉదయం' === t
                ? e
                : 'మధ్యాహ్నం' === t
                ? e >= 10
                  ? e
                  : e + 12
                : 'సాయంత్రం' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            return e < 4 ? 'రాత్రి' : e < 10 ? 'ఉదయం' : e < 17 ? 'మధ్యాహ్నం' : e < 20 ? 'సాయంత్రం' : 'రాత్రి';
          },
          week: { dow: 0, doy: 6 },
        });
      })(n(1781));
    },
    1914: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('tet', {
          months: 'Janeiru_Fevereiru_Marsu_Abril_Maiu_Juñu_Jullu_Agustu_Setembru_Outubru_Novembru_Dezembru'.split('_'),
          monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
          weekdays: 'Domingu_Segunda_Tersa_Kuarta_Kinta_Sesta_Sabadu'.split('_'),
          weekdaysShort: 'Dom_Seg_Ters_Kua_Kint_Sest_Sab'.split('_'),
          weekdaysMin: 'Do_Seg_Te_Ku_Ki_Ses_Sa'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Ohin iha] LT',
            nextDay: '[Aban iha] LT',
            nextWeek: 'dddd [iha] LT',
            lastDay: '[Horiseik iha] LT',
            lastWeek: 'dddd [semana kotuk] [iha] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'iha %s',
            past: '%s liuba',
            s: 'segundu balun',
            ss: 'segundu %d',
            m: 'minutu ida',
            mm: 'minutu %d',
            h: 'oras ida',
            hh: 'oras %d',
            d: 'loron ida',
            dd: 'loron %d',
            M: 'fulan ida',
            MM: 'fulan %d',
            y: 'tinan ida',
            yy: 'tinan %d',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
          ordinal: function (e) {
            var t = e % 10;
            return e + (1 == ~~((e % 100) / 10) ? 'th' : 1 === t ? 'st' : 2 === t ? 'nd' : 3 === t ? 'rd' : 'th');
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1915: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = {
          0: '-ум',
          1: '-ум',
          2: '-юм',
          3: '-юм',
          4: '-ум',
          5: '-ум',
          6: '-ум',
          7: '-ум',
          8: '-ум',
          9: '-ум',
          10: '-ум',
          12: '-ум',
          13: '-ум',
          20: '-ум',
          30: '-юм',
          40: '-ум',
          50: '-ум',
          60: '-ум',
          70: '-ум',
          80: '-ум',
          90: '-ум',
          100: '-ум',
        };
        e.defineLocale('tg', {
          months: {
            format: 'январи_феврали_марти_апрели_майи_июни_июли_августи_сентябри_октябри_ноябри_декабри'.split('_'),
            standalone: 'январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр'.split('_'),
          },
          monthsShort: 'янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек'.split('_'),
          weekdays: 'якшанбе_душанбе_сешанбе_чоршанбе_панҷшанбе_ҷумъа_шанбе'.split('_'),
          weekdaysShort: 'яшб_дшб_сшб_чшб_пшб_ҷум_шнб'.split('_'),
          weekdaysMin: 'яш_дш_сш_чш_пш_ҷм_шб'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Имрӯз соати] LT',
            nextDay: '[Фардо соати] LT',
            lastDay: '[Дирӯз соати] LT',
            nextWeek: 'dddd[и] [ҳафтаи оянда соати] LT',
            lastWeek: 'dddd[и] [ҳафтаи гузашта соати] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'баъди %s',
            past: '%s пеш',
            s: 'якчанд сония',
            m: 'як дақиқа',
            mm: '%d дақиқа',
            h: 'як соат',
            hh: '%d соат',
            d: 'як рӯз',
            dd: '%d рӯз',
            M: 'як моҳ',
            MM: '%d моҳ',
            y: 'як сол',
            yy: '%d сол',
          },
          meridiemParse: /шаб|субҳ|рӯз|бегоҳ/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'шаб' === t
                ? e < 4
                  ? e
                  : e + 12
                : 'субҳ' === t
                ? e
                : 'рӯз' === t
                ? e >= 11
                  ? e
                  : e + 12
                : 'бегоҳ' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            return e < 4 ? 'шаб' : e < 11 ? 'субҳ' : e < 16 ? 'рӯз' : e < 19 ? 'бегоҳ' : 'шаб';
          },
          dayOfMonthOrdinalParse: /\d{1,2}-(ум|юм)/,
          ordinal: function (e) {
            return e + (t[e] || t[e % 10] || t[e >= 100 ? 100 : null]);
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1916: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('th', {
          months:
            'มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม'.split(
              '_',
            ),
          monthsShort: 'ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.'.split('_'),
          monthsParseExact: !0,
          weekdays: 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_'),
          weekdaysShort: 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์'.split('_'),
          weekdaysMin: 'อา._จ._อ._พ._พฤ._ศ._ส.'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY เวลา H:mm',
            LLLL: 'วันddddที่ D MMMM YYYY เวลา H:mm',
          },
          meridiemParse: /ก่อนเที่ยง|หลังเที่ยง/,
          isPM: function (e) {
            return 'หลังเที่ยง' === e;
          },
          meridiem: function (e, t, n) {
            return e < 12 ? 'ก่อนเที่ยง' : 'หลังเที่ยง';
          },
          calendar: {
            sameDay: '[วันนี้ เวลา] LT',
            nextDay: '[พรุ่งนี้ เวลา] LT',
            nextWeek: 'dddd[หน้า เวลา] LT',
            lastDay: '[เมื่อวานนี้ เวลา] LT',
            lastWeek: '[วัน]dddd[ที่แล้ว เวลา] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'อีก %s',
            past: '%sที่แล้ว',
            s: 'ไม่กี่วินาที',
            ss: '%d วินาที',
            m: '1 นาที',
            mm: '%d นาที',
            h: '1 ชั่วโมง',
            hh: '%d ชั่วโมง',
            d: '1 วัน',
            dd: '%d วัน',
            w: '1 สัปดาห์',
            ww: '%d สัปดาห์',
            M: '1 เดือน',
            MM: '%d เดือน',
            y: '1 ปี',
            yy: '%d ปี',
          },
        });
      })(n(1781));
    },
    1917: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = {
          1: "'inji",
          5: "'inji",
          8: "'inji",
          70: "'inji",
          80: "'inji",
          2: "'nji",
          7: "'nji",
          20: "'nji",
          50: "'nji",
          3: "'ünji",
          4: "'ünji",
          100: "'ünji",
          6: "'njy",
          9: "'unjy",
          10: "'unjy",
          30: "'unjy",
          60: "'ynjy",
          90: "'ynjy",
        };
        e.defineLocale('tk', {
          months: 'Ýanwar_Fewral_Mart_Aprel_Maý_Iýun_Iýul_Awgust_Sentýabr_Oktýabr_Noýabr_Dekabr'.split('_'),
          monthsShort: 'Ýan_Few_Mar_Apr_Maý_Iýn_Iýl_Awg_Sen_Okt_Noý_Dek'.split('_'),
          weekdays: 'Ýekşenbe_Duşenbe_Sişenbe_Çarşenbe_Penşenbe_Anna_Şenbe'.split('_'),
          weekdaysShort: 'Ýek_Duş_Siş_Çar_Pen_Ann_Şen'.split('_'),
          weekdaysMin: 'Ýk_Dş_Sş_Çr_Pn_An_Şn'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[bugün sagat] LT',
            nextDay: '[ertir sagat] LT',
            nextWeek: '[indiki] dddd [sagat] LT',
            lastDay: '[düýn] LT',
            lastWeek: '[geçen] dddd [sagat] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s soň',
            past: '%s öň',
            s: 'birnäçe sekunt',
            m: 'bir minut',
            mm: '%d minut',
            h: 'bir sagat',
            hh: '%d sagat',
            d: 'bir gün',
            dd: '%d gün',
            M: 'bir aý',
            MM: '%d aý',
            y: 'bir ýyl',
            yy: '%d ýyl',
          },
          ordinal: function (e, n) {
            switch (n) {
              case 'd':
              case 'D':
              case 'Do':
              case 'DD':
                return e;
              default:
                if (0 === e) return e + "'unjy";
                var a = e % 10;
                return e + (t[a] || t[(e % 100) - a] || t[e >= 100 ? 100 : null]);
            }
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1918: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('tl-ph', {
          months: 'Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre'.split('_'),
          monthsShort: 'Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis'.split('_'),
          weekdays: 'Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado'.split('_'),
          weekdaysShort: 'Lin_Lun_Mar_Miy_Huw_Biy_Sab'.split('_'),
          weekdaysMin: 'Li_Lu_Ma_Mi_Hu_Bi_Sab'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'MM/D/YYYY',
            LL: 'MMMM D, YYYY',
            LLL: 'MMMM D, YYYY HH:mm',
            LLLL: 'dddd, MMMM DD, YYYY HH:mm',
          },
          calendar: {
            sameDay: 'LT [ngayong araw]',
            nextDay: '[Bukas ng] LT',
            nextWeek: 'LT [sa susunod na] dddd',
            lastDay: 'LT [kahapon]',
            lastWeek: 'LT [noong nakaraang] dddd',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'sa loob ng %s',
            past: '%s ang nakalipas',
            s: 'ilang segundo',
            ss: '%d segundo',
            m: 'isang minuto',
            mm: '%d minuto',
            h: 'isang oras',
            hh: '%d oras',
            d: 'isang araw',
            dd: '%d araw',
            M: 'isang buwan',
            MM: '%d buwan',
            y: 'isang taon',
            yy: '%d taon',
          },
          dayOfMonthOrdinalParse: /\d{1,2}/,
          ordinal: function (e) {
            return e;
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1919: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = 'pagh_wa’_cha’_wej_loS_vagh_jav_Soch_chorgh_Hut'.split('_');
        function n(e, n, a, r) {
          var i = (function (e) {
            var n = Math.floor((e % 1e3) / 100),
              a = Math.floor((e % 100) / 10),
              r = e % 10,
              i = '';
            return (
              n > 0 && (i += t[n] + 'vatlh'),
              a > 0 && (i += ('' !== i ? ' ' : '') + t[a] + 'maH'),
              r > 0 && (i += ('' !== i ? ' ' : '') + t[r]),
              '' === i ? 'pagh' : i
            );
          })(e);
          switch (a) {
            case 'ss':
              return i + ' lup';
            case 'mm':
              return i + ' tup';
            case 'hh':
              return i + ' rep';
            case 'dd':
              return i + ' jaj';
            case 'MM':
              return i + ' jar';
            case 'yy':
              return i + ' DIS';
          }
        }
        e.defineLocale('tlh', {
          months:
            'tera’ jar wa’_tera’ jar cha’_tera’ jar wej_tera’ jar loS_tera’ jar vagh_tera’ jar jav_tera’ jar Soch_tera’ jar chorgh_tera’ jar Hut_tera’ jar wa’maH_tera’ jar wa’maH wa’_tera’ jar wa’maH cha’'.split(
              '_',
            ),
          monthsShort:
            'jar wa’_jar cha’_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar wa’maH_jar wa’maH wa’_jar wa’maH cha’'.split(
              '_',
            ),
          monthsParseExact: !0,
          weekdays: 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
          weekdaysShort: 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
          weekdaysMin: 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[DaHjaj] LT',
            nextDay: '[wa’leS] LT',
            nextWeek: 'LLL',
            lastDay: '[wa’Hu’] LT',
            lastWeek: 'LLL',
            sameElse: 'L',
          },
          relativeTime: {
            future: function (e) {
              var t = e;
              return (t =
                -1 !== e.indexOf('jaj')
                  ? t.slice(0, -3) + 'leS'
                  : -1 !== e.indexOf('jar')
                  ? t.slice(0, -3) + 'waQ'
                  : -1 !== e.indexOf('DIS')
                  ? t.slice(0, -3) + 'nem'
                  : t + ' pIq');
            },
            past: function (e) {
              var t = e;
              return (t =
                -1 !== e.indexOf('jaj')
                  ? t.slice(0, -3) + 'Hu’'
                  : -1 !== e.indexOf('jar')
                  ? t.slice(0, -3) + 'wen'
                  : -1 !== e.indexOf('DIS')
                  ? t.slice(0, -3) + 'ben'
                  : t + ' ret');
            },
            s: 'puS lup',
            ss: n,
            m: 'wa’ tup',
            mm: n,
            h: 'wa’ rep',
            hh: n,
            d: 'wa’ jaj',
            dd: n,
            M: 'wa’ jar',
            MM: n,
            y: 'wa’ DIS',
            yy: n,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1920: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = {
          1: "'inci",
          5: "'inci",
          8: "'inci",
          70: "'inci",
          80: "'inci",
          2: "'nci",
          7: "'nci",
          20: "'nci",
          50: "'nci",
          3: "'üncü",
          4: "'üncü",
          100: "'üncü",
          6: "'ncı",
          9: "'uncu",
          10: "'uncu",
          30: "'uncu",
          60: "'ıncı",
          90: "'ıncı",
        };
        e.defineLocale('tr', {
          months: 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split('_'),
          monthsShort: 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
          weekdays: 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split('_'),
          weekdaysShort: 'Paz_Pts_Sal_Çar_Per_Cum_Cts'.split('_'),
          weekdaysMin: 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_'),
          meridiem: function (e, t, n) {
            return e < 12 ? (n ? 'öö' : 'ÖÖ') : n ? 'ös' : 'ÖS';
          },
          meridiemParse: /öö|ÖÖ|ös|ÖS/,
          isPM: function (e) {
            return 'ös' === e || 'ÖS' === e;
          },
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[bugün saat] LT',
            nextDay: '[yarın saat] LT',
            nextWeek: '[gelecek] dddd [saat] LT',
            lastDay: '[dün] LT',
            lastWeek: '[geçen] dddd [saat] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s sonra',
            past: '%s önce',
            s: 'birkaç saniye',
            ss: '%d saniye',
            m: 'bir dakika',
            mm: '%d dakika',
            h: 'bir saat',
            hh: '%d saat',
            d: 'bir gün',
            dd: '%d gün',
            w: 'bir hafta',
            ww: '%d hafta',
            M: 'bir ay',
            MM: '%d ay',
            y: 'bir yıl',
            yy: '%d yıl',
          },
          ordinal: function (e, n) {
            switch (n) {
              case 'd':
              case 'D':
              case 'Do':
              case 'DD':
                return e;
              default:
                if (0 === e) return e + "'ıncı";
                var a = e % 10;
                return e + (t[a] || t[(e % 100) - a] || t[e >= 100 ? 100 : null]);
            }
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1921: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n, a) {
          var r = {
            s: ['viensas secunds', "'iensas secunds"],
            ss: [e + ' secunds', e + ' secunds'],
            m: ["'n míut", "'iens míut"],
            mm: [e + ' míuts', e + ' míuts'],
            h: ["'n þora", "'iensa þora"],
            hh: [e + ' þoras', e + ' þoras'],
            d: ["'n ziua", "'iensa ziua"],
            dd: [e + ' ziuas', e + ' ziuas'],
            M: ["'n mes", "'iens mes"],
            MM: [e + ' mesen', e + ' mesen'],
            y: ["'n ar", "'iens ar"],
            yy: [e + ' ars', e + ' ars'],
          };
          return a || t ? r[n][0] : r[n][1];
        }
        e.defineLocale('tzl', {
          months: 'Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar'.split('_'),
          monthsShort: 'Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec'.split('_'),
          weekdays: 'Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi'.split('_'),
          weekdaysShort: 'Súl_Lún_Mai_Már_Xhú_Vié_Sát'.split('_'),
          weekdaysMin: 'Sú_Lú_Ma_Má_Xh_Vi_Sá'.split('_'),
          longDateFormat: {
            LT: 'HH.mm',
            LTS: 'HH.mm.ss',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM [dallas] YYYY',
            LLL: 'D. MMMM [dallas] YYYY HH.mm',
            LLLL: 'dddd, [li] D. MMMM [dallas] YYYY HH.mm',
          },
          meridiemParse: /d\'o|d\'a/i,
          isPM: function (e) {
            return "d'o" === e.toLowerCase();
          },
          meridiem: function (e, t, n) {
            return e > 11 ? (n ? "d'o" : "D'O") : n ? "d'a" : "D'A";
          },
          calendar: {
            sameDay: '[oxhi à] LT',
            nextDay: '[demà à] LT',
            nextWeek: 'dddd [à] LT',
            lastDay: '[ieiri à] LT',
            lastWeek: '[sür el] dddd [lasteu à] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'osprei %s',
            past: 'ja%s',
            s: t,
            ss: t,
            m: t,
            mm: t,
            h: t,
            hh: t,
            d: t,
            dd: t,
            M: t,
            MM: t,
            y: t,
            yy: t,
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal: '%d.',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1922: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('tzm', {
          months: 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
          monthsShort: 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
          weekdays: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
          weekdaysShort: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
          weekdaysMin: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[ⴰⵙⴷⵅ ⴴ] LT',
            nextDay: '[ⴰⵙⴽⴰ ⴴ] LT',
            nextWeek: 'dddd [ⴴ] LT',
            lastDay: '[ⴰⵚⴰⵏⵜ ⴴ] LT',
            lastWeek: 'dddd [ⴴ] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s',
            past: 'ⵢⴰⵏ %s',
            s: 'ⵉⵎⵉⴽ',
            ss: '%d ⵉⵎⵉⴽ',
            m: 'ⵎⵉⵏⵓⴺ',
            mm: '%d ⵎⵉⵏⵓⴺ',
            h: 'ⵙⴰⵄⴰ',
            hh: '%d ⵜⴰⵙⵙⴰⵄⵉⵏ',
            d: 'ⴰⵙⵙ',
            dd: '%d oⵙⵙⴰⵏ',
            M: 'ⴰⵢoⵓⵔ',
            MM: '%d ⵉⵢⵢⵉⵔⵏ',
            y: 'ⴰⵙⴳⴰⵙ',
            yy: '%d ⵉⵙⴳⴰⵙⵏ',
          },
          week: { dow: 6, doy: 12 },
        });
      })(n(1781));
    },
    1923: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('tzm-latn', {
          months: 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
          monthsShort: 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split(
            '_',
          ),
          weekdays: 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
          weekdaysShort: 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
          weekdaysMin: 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[asdkh g] LT',
            nextDay: '[aska g] LT',
            nextWeek: 'dddd [g] LT',
            lastDay: '[assant g] LT',
            lastWeek: 'dddd [g] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'dadkh s yan %s',
            past: 'yan %s',
            s: 'imik',
            ss: '%d imik',
            m: 'minuḍ',
            mm: '%d minuḍ',
            h: 'saɛa',
            hh: '%d tassaɛin',
            d: 'ass',
            dd: '%d ossan',
            M: 'ayowr',
            MM: '%d iyyirn',
            y: 'asgas',
            yy: '%d isgasn',
          },
          week: { dow: 6, doy: 12 },
        });
      })(n(1781));
    },
    1924: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('ug-cn', {
          months: 'يانۋار_فېۋرال_مارت_ئاپرېل_ماي_ئىيۇن_ئىيۇل_ئاۋغۇست_سېنتەبىر_ئۆكتەبىر_نويابىر_دېكابىر'.split('_'),
          monthsShort: 'يانۋار_فېۋرال_مارت_ئاپرېل_ماي_ئىيۇن_ئىيۇل_ئاۋغۇست_سېنتەبىر_ئۆكتەبىر_نويابىر_دېكابىر'.split('_'),
          weekdays: 'يەكشەنبە_دۈشەنبە_سەيشەنبە_چارشەنبە_پەيشەنبە_جۈمە_شەنبە'.split('_'),
          weekdaysShort: 'يە_دۈ_سە_چا_پە_جۈ_شە'.split('_'),
          weekdaysMin: 'يە_دۈ_سە_چا_پە_جۈ_شە'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'YYYY-MM-DD',
            LL: 'YYYY-يىلىM-ئاينىڭD-كۈنى',
            LLL: 'YYYY-يىلىM-ئاينىڭD-كۈنى، HH:mm',
            LLLL: 'dddd، YYYY-يىلىM-ئاينىڭD-كۈنى، HH:mm',
          },
          meridiemParse: /يېرىم كېچە|سەھەر|چۈشتىن بۇرۇن|چۈش|چۈشتىن كېيىن|كەچ/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              'يېرىم كېچە' === t || 'سەھەر' === t || 'چۈشتىن بۇرۇن' === t
                ? e
                : 'چۈشتىن كېيىن' === t || 'كەچ' === t
                ? e + 12
                : e >= 11
                ? e
                : e + 12
            );
          },
          meridiem: function (e, t, n) {
            var a = 100 * e + t;
            return a < 600
              ? 'يېرىم كېچە'
              : a < 900
              ? 'سەھەر'
              : a < 1130
              ? 'چۈشتىن بۇرۇن'
              : a < 1230
              ? 'چۈش'
              : a < 1800
              ? 'چۈشتىن كېيىن'
              : 'كەچ';
          },
          calendar: {
            sameDay: '[بۈگۈن سائەت] LT',
            nextDay: '[ئەتە سائەت] LT',
            nextWeek: '[كېلەركى] dddd [سائەت] LT',
            lastDay: '[تۆنۈگۈن] LT',
            lastWeek: '[ئالدىنقى] dddd [سائەت] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s كېيىن',
            past: '%s بۇرۇن',
            s: 'نەچچە سېكونت',
            ss: '%d سېكونت',
            m: 'بىر مىنۇت',
            mm: '%d مىنۇت',
            h: 'بىر سائەت',
            hh: '%d سائەت',
            d: 'بىر كۈن',
            dd: '%d كۈن',
            M: 'بىر ئاي',
            MM: '%d ئاي',
            y: 'بىر يىل',
            yy: '%d يىل',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(-كۈنى|-ئاي|-ھەپتە)/,
          ordinal: function (e, t) {
            switch (t) {
              case 'd':
              case 'D':
              case 'DDD':
                return e + '-كۈنى';
              case 'w':
              case 'W':
                return e + '-ھەپتە';
              default:
                return e;
            }
          },
          preparse: function (e) {
            return e.replace(/،/g, ',');
          },
          postformat: function (e) {
            return e.replace(/,/g, '،');
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1925: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        function t(e, t, n) {
          var a, r;
          return 'm' === n
            ? t
              ? 'хвилина'
              : 'хвилину'
            : 'h' === n
            ? t
              ? 'година'
              : 'годину'
            : e +
              ' ' +
              ((a = +e),
              (r = {
                ss: t ? 'секунда_секунди_секунд' : 'секунду_секунди_секунд',
                mm: t ? 'хвилина_хвилини_хвилин' : 'хвилину_хвилини_хвилин',
                hh: t ? 'година_години_годин' : 'годину_години_годин',
                dd: 'день_дні_днів',
                MM: 'місяць_місяці_місяців',
                yy: 'рік_роки_років',
              }[n].split('_')),
              a % 10 == 1 && a % 100 != 11
                ? r[0]
                : a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 10 || a % 100 >= 20)
                ? r[1]
                : r[2]);
        }
        function n(e) {
          return function () {
            return e + 'о' + (11 === this.hours() ? 'б' : '') + '] LT';
          };
        }
        e.defineLocale('uk', {
          months: {
            format: 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_'),
            standalone:
              'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split(
                '_',
              ),
          },
          monthsShort: 'січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд'.split('_'),
          weekdays: function (e, t) {
            var n = {
              nominative: 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
              accusative: 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_'),
              genitive: 'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split('_'),
            };
            return !0 === e
              ? n.nominative.slice(1, 7).concat(n.nominative.slice(0, 1))
              : e
              ? n[
                  /(\[[ВвУу]\]) ?dddd/.test(t)
                    ? 'accusative'
                    : /\[?(?:минулої|наступної)? ?\] ?dddd/.test(t)
                    ? 'genitive'
                    : 'nominative'
                ][e.day()]
              : n.nominative;
          },
          weekdaysShort: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
          weekdaysMin: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY р.',
            LLL: 'D MMMM YYYY р., HH:mm',
            LLLL: 'dddd, D MMMM YYYY р., HH:mm',
          },
          calendar: {
            sameDay: n('[Сьогодні '),
            nextDay: n('[Завтра '),
            lastDay: n('[Вчора '),
            nextWeek: n('[У] dddd ['),
            lastWeek: function () {
              switch (this.day()) {
                case 0:
                case 3:
                case 5:
                case 6:
                  return n('[Минулої] dddd [').call(this);
                case 1:
                case 2:
                case 4:
                  return n('[Минулого] dddd [').call(this);
              }
            },
            sameElse: 'L',
          },
          relativeTime: {
            future: 'за %s',
            past: '%s тому',
            s: 'декілька секунд',
            ss: t,
            m: t,
            mm: t,
            h: 'годину',
            hh: t,
            d: 'день',
            dd: t,
            M: 'місяць',
            MM: t,
            y: 'рік',
            yy: t,
          },
          meridiemParse: /ночі|ранку|дня|вечора/,
          isPM: function (e) {
            return /^(дня|вечора)$/.test(e);
          },
          meridiem: function (e, t, n) {
            return e < 4 ? 'ночі' : e < 12 ? 'ранку' : e < 17 ? 'дня' : 'вечора';
          },
          dayOfMonthOrdinalParse: /\d{1,2}-(й|го)/,
          ordinal: function (e, t) {
            switch (t) {
              case 'M':
              case 'd':
              case 'DDD':
              case 'w':
              case 'W':
                return e + '-й';
              case 'D':
                return e + '-го';
              default:
                return e;
            }
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1926: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        var t = [
            'جنوری',
            'فروری',
            'مارچ',
            'اپریل',
            'مئی',
            'جون',
            'جولائی',
            'اگست',
            'ستمبر',
            'اکتوبر',
            'نومبر',
            'دسمبر',
          ],
          n = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
        e.defineLocale('ur', {
          months: t,
          monthsShort: t,
          weekdays: n,
          weekdaysShort: n,
          weekdaysMin: n,
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd، D MMMM YYYY HH:mm',
          },
          meridiemParse: /صبح|شام/,
          isPM: function (e) {
            return 'شام' === e;
          },
          meridiem: function (e, t, n) {
            return e < 12 ? 'صبح' : 'شام';
          },
          calendar: {
            sameDay: '[آج بوقت] LT',
            nextDay: '[کل بوقت] LT',
            nextWeek: 'dddd [بوقت] LT',
            lastDay: '[گذشتہ روز بوقت] LT',
            lastWeek: '[گذشتہ] dddd [بوقت] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s بعد',
            past: '%s قبل',
            s: 'چند سیکنڈ',
            ss: '%d سیکنڈ',
            m: 'ایک منٹ',
            mm: '%d منٹ',
            h: 'ایک گھنٹہ',
            hh: '%d گھنٹے',
            d: 'ایک دن',
            dd: '%d دن',
            M: 'ایک ماہ',
            MM: '%d ماہ',
            y: 'ایک سال',
            yy: '%d سال',
          },
          preparse: function (e) {
            return e.replace(/،/g, ',');
          },
          postformat: function (e) {
            return e.replace(/,/g, '،');
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1927: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('uz', {
          months: 'январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр'.split('_'),
          monthsShort: 'янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек'.split('_'),
          weekdays: 'Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба'.split('_'),
          weekdaysShort: 'Якш_Душ_Сеш_Чор_Пай_Жум_Шан'.split('_'),
          weekdaysMin: 'Як_Ду_Се_Чо_Па_Жу_Ша'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'D MMMM YYYY, dddd HH:mm',
          },
          calendar: {
            sameDay: '[Бугун соат] LT [да]',
            nextDay: '[Эртага] LT [да]',
            nextWeek: 'dddd [куни соат] LT [да]',
            lastDay: '[Кеча соат] LT [да]',
            lastWeek: '[Утган] dddd [куни соат] LT [да]',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'Якин %s ичида',
            past: 'Бир неча %s олдин',
            s: 'фурсат',
            ss: '%d фурсат',
            m: 'бир дакика',
            mm: '%d дакика',
            h: 'бир соат',
            hh: '%d соат',
            d: 'бир кун',
            dd: '%d кун',
            M: 'бир ой',
            MM: '%d ой',
            y: 'бир йил',
            yy: '%d йил',
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1928: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('uz-latn', {
          months: 'Yanvar_Fevral_Mart_Aprel_May_Iyun_Iyul_Avgust_Sentabr_Oktabr_Noyabr_Dekabr'.split('_'),
          monthsShort: 'Yan_Fev_Mar_Apr_May_Iyun_Iyul_Avg_Sen_Okt_Noy_Dek'.split('_'),
          weekdays: 'Yakshanba_Dushanba_Seshanba_Chorshanba_Payshanba_Juma_Shanba'.split('_'),
          weekdaysShort: 'Yak_Dush_Sesh_Chor_Pay_Jum_Shan'.split('_'),
          weekdaysMin: 'Ya_Du_Se_Cho_Pa_Ju_Sha'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'D MMMM YYYY, dddd HH:mm',
          },
          calendar: {
            sameDay: '[Bugun soat] LT [da]',
            nextDay: '[Ertaga] LT [da]',
            nextWeek: 'dddd [kuni soat] LT [da]',
            lastDay: '[Kecha soat] LT [da]',
            lastWeek: "[O'tgan] dddd [kuni soat] LT [da]",
            sameElse: 'L',
          },
          relativeTime: {
            future: 'Yaqin %s ichida',
            past: 'Bir necha %s oldin',
            s: 'soniya',
            ss: '%d soniya',
            m: 'bir daqiqa',
            mm: '%d daqiqa',
            h: 'bir soat',
            hh: '%d soat',
            d: 'bir kun',
            dd: '%d kun',
            M: 'bir oy',
            MM: '%d oy',
            y: 'bir yil',
            yy: '%d yil',
          },
          week: { dow: 1, doy: 7 },
        });
      })(n(1781));
    },
    1929: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('vi', {
          months:
            'tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12'.split(
              '_',
            ),
          monthsShort: 'Thg 01_Thg 02_Thg 03_Thg 04_Thg 05_Thg 06_Thg 07_Thg 08_Thg 09_Thg 10_Thg 11_Thg 12'.split('_'),
          monthsParseExact: !0,
          weekdays: 'chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy'.split('_'),
          weekdaysShort: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
          weekdaysMin: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
          weekdaysParseExact: !0,
          meridiemParse: /sa|ch/i,
          isPM: function (e) {
            return /^ch$/i.test(e);
          },
          meridiem: function (e, t, n) {
            return e < 12 ? (n ? 'sa' : 'SA') : n ? 'ch' : 'CH';
          },
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM [năm] YYYY',
            LLL: 'D MMMM [năm] YYYY HH:mm',
            LLLL: 'dddd, D MMMM [năm] YYYY HH:mm',
            l: 'DD/M/YYYY',
            ll: 'D MMM YYYY',
            lll: 'D MMM YYYY HH:mm',
            llll: 'ddd, D MMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[Hôm nay lúc] LT',
            nextDay: '[Ngày mai lúc] LT',
            nextWeek: 'dddd [tuần tới lúc] LT',
            lastDay: '[Hôm qua lúc] LT',
            lastWeek: 'dddd [tuần trước lúc] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: '%s tới',
            past: '%s trước',
            s: 'vài giây',
            ss: '%d giây',
            m: 'một phút',
            mm: '%d phút',
            h: 'một giờ',
            hh: '%d giờ',
            d: 'một ngày',
            dd: '%d ngày',
            w: 'một tuần',
            ww: '%d tuần',
            M: 'một tháng',
            MM: '%d tháng',
            y: 'một năm',
            yy: '%d năm',
          },
          dayOfMonthOrdinalParse: /\d{1,2}/,
          ordinal: function (e) {
            return e;
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1930: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('x-pseudo', {
          months:
            'J~áñúá~rý_F~ébrú~árý_~Márc~h_Áp~ríl_~Máý_~Júñé~_Júl~ý_Áú~gúst~_Sép~témb~ér_Ó~ctób~ér_Ñ~óvém~bér_~Décé~mbér'.split(
              '_',
            ),
          monthsShort: 'J~áñ_~Féb_~Már_~Ápr_~Máý_~Júñ_~Júl_~Áúg_~Sép_~Óct_~Ñóv_~Déc'.split('_'),
          monthsParseExact: !0,
          weekdays: 'S~úñdá~ý_Mó~ñdáý~_Túé~sdáý~_Wéd~ñésd~áý_T~húrs~dáý_~Fríd~áý_S~átúr~dáý'.split('_'),
          weekdaysShort: 'S~úñ_~Móñ_~Túé_~Wéd_~Thú_~Frí_~Sát'.split('_'),
          weekdaysMin: 'S~ú_Mó~_Tú_~Wé_T~h_Fr~_Sá'.split('_'),
          weekdaysParseExact: !0,
          longDateFormat: {
            LT: 'HH:mm',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
          },
          calendar: {
            sameDay: '[T~ódá~ý át] LT',
            nextDay: '[T~ómó~rró~w át] LT',
            nextWeek: 'dddd [át] LT',
            lastDay: '[Ý~ést~érdá~ý át] LT',
            lastWeek: '[L~ást] dddd [át] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'í~ñ %s',
            past: '%s á~gó',
            s: 'á ~féw ~sécó~ñds',
            ss: '%d s~écóñ~ds',
            m: 'á ~míñ~úté',
            mm: '%d m~íñú~tés',
            h: 'á~ñ hó~úr',
            hh: '%d h~óúrs',
            d: 'á ~dáý',
            dd: '%d d~áýs',
            M: 'á ~móñ~th',
            MM: '%d m~óñt~hs',
            y: 'á ~ýéár',
            yy: '%d ý~éárs',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
          ordinal: function (e) {
            var t = e % 10;
            return e + (1 == ~~((e % 100) / 10) ? 'th' : 1 === t ? 'st' : 2 === t ? 'nd' : 3 === t ? 'rd' : 'th');
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1931: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('yo', {
          months: 'Sẹ́rẹ́_Èrèlè_Ẹrẹ̀nà_Ìgbé_Èbibi_Òkùdu_Agẹmo_Ògún_Owewe_Ọ̀wàrà_Bélú_Ọ̀pẹ̀̀'.split('_'),
          monthsShort: 'Sẹ́r_Èrl_Ẹrn_Ìgb_Èbi_Òkù_Agẹ_Ògú_Owe_Ọ̀wà_Bél_Ọ̀pẹ̀̀'.split('_'),
          weekdays: 'Àìkú_Ajé_Ìsẹ́gun_Ọjọ́rú_Ọjọ́bọ_Ẹtì_Àbámẹ́ta'.split('_'),
          weekdaysShort: 'Àìk_Ajé_Ìsẹ́_Ọjr_Ọjb_Ẹtì_Àbá'.split('_'),
          weekdaysMin: 'Àì_Aj_Ìs_Ọr_Ọb_Ẹt_Àb'.split('_'),
          longDateFormat: {
            LT: 'h:mm A',
            LTS: 'h:mm:ss A',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY h:mm A',
            LLLL: 'dddd, D MMMM YYYY h:mm A',
          },
          calendar: {
            sameDay: '[Ònì ni] LT',
            nextDay: '[Ọ̀la ni] LT',
            nextWeek: "dddd [Ọsẹ̀ tón'bọ] [ni] LT",
            lastDay: '[Àna ni] LT',
            lastWeek: 'dddd [Ọsẹ̀ tólọ́] [ni] LT',
            sameElse: 'L',
          },
          relativeTime: {
            future: 'ní %s',
            past: '%s kọjá',
            s: 'ìsẹjú aayá die',
            ss: 'aayá %d',
            m: 'ìsẹjú kan',
            mm: 'ìsẹjú %d',
            h: 'wákati kan',
            hh: 'wákati %d',
            d: 'ọjọ́ kan',
            dd: 'ọjọ́ %d',
            M: 'osù kan',
            MM: 'osù %d',
            y: 'ọdún kan',
            yy: 'ọdún %d',
          },
          dayOfMonthOrdinalParse: /ọjọ́\s\d{1,2}/,
          ordinal: 'ọjọ́ %d',
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1932: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('zh-cn', {
          months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
          monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
          weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
          weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
          weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'YYYY/MM/DD',
            LL: 'YYYY年M月D日',
            LLL: 'YYYY年M月D日Ah点mm分',
            LLLL: 'YYYY年M月D日ddddAh点mm分',
            l: 'YYYY/M/D',
            ll: 'YYYY年M月D日',
            lll: 'YYYY年M月D日 HH:mm',
            llll: 'YYYY年M月D日dddd HH:mm',
          },
          meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              '凌晨' === t || '早上' === t || '上午' === t
                ? e
                : '下午' === t || '晚上' === t
                ? e + 12
                : e >= 11
                ? e
                : e + 12
            );
          },
          meridiem: function (e, t, n) {
            var a = 100 * e + t;
            return a < 600
              ? '凌晨'
              : a < 900
              ? '早上'
              : a < 1130
              ? '上午'
              : a < 1230
              ? '中午'
              : a < 1800
              ? '下午'
              : '晚上';
          },
          calendar: {
            sameDay: '[今天]LT',
            nextDay: '[明天]LT',
            nextWeek: function (e) {
              return e.week() !== this.week() ? '[下]dddLT' : '[本]dddLT';
            },
            lastDay: '[昨天]LT',
            lastWeek: function (e) {
              return this.week() !== e.week() ? '[上]dddLT' : '[本]dddLT';
            },
            sameElse: 'L',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
          ordinal: function (e, t) {
            switch (t) {
              case 'd':
              case 'D':
              case 'DDD':
                return e + '日';
              case 'M':
                return e + '月';
              case 'w':
              case 'W':
                return e + '周';
              default:
                return e;
            }
          },
          relativeTime: {
            future: '%s后',
            past: '%s前',
            s: '几秒',
            ss: '%d 秒',
            m: '1 分钟',
            mm: '%d 分钟',
            h: '1 小时',
            hh: '%d 小时',
            d: '1 天',
            dd: '%d 天',
            w: '1 周',
            ww: '%d 周',
            M: '1 个月',
            MM: '%d 个月',
            y: '1 年',
            yy: '%d 年',
          },
          week: { dow: 1, doy: 4 },
        });
      })(n(1781));
    },
    1933: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('zh-hk', {
          months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
          monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
          weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
          weekdaysShort: '週日_週一_週二_週三_週四_週五_週六'.split('_'),
          weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'YYYY/MM/DD',
            LL: 'YYYY年M月D日',
            LLL: 'YYYY年M月D日 HH:mm',
            LLLL: 'YYYY年M月D日dddd HH:mm',
            l: 'YYYY/M/D',
            ll: 'YYYY年M月D日',
            lll: 'YYYY年M月D日 HH:mm',
            llll: 'YYYY年M月D日dddd HH:mm',
          },
          meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              '凌晨' === t || '早上' === t || '上午' === t
                ? e
                : '中午' === t
                ? e >= 11
                  ? e
                  : e + 12
                : '下午' === t || '晚上' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            var a = 100 * e + t;
            return a < 600
              ? '凌晨'
              : a < 900
              ? '早上'
              : a < 1200
              ? '上午'
              : 1200 === a
              ? '中午'
              : a < 1800
              ? '下午'
              : '晚上';
          },
          calendar: {
            sameDay: '[今天]LT',
            nextDay: '[明天]LT',
            nextWeek: '[下]ddddLT',
            lastDay: '[昨天]LT',
            lastWeek: '[上]ddddLT',
            sameElse: 'L',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
          ordinal: function (e, t) {
            switch (t) {
              case 'd':
              case 'D':
              case 'DDD':
                return e + '日';
              case 'M':
                return e + '月';
              case 'w':
              case 'W':
                return e + '週';
              default:
                return e;
            }
          },
          relativeTime: {
            future: '%s後',
            past: '%s前',
            s: '幾秒',
            ss: '%d 秒',
            m: '1 分鐘',
            mm: '%d 分鐘',
            h: '1 小時',
            hh: '%d 小時',
            d: '1 天',
            dd: '%d 天',
            M: '1 個月',
            MM: '%d 個月',
            y: '1 年',
            yy: '%d 年',
          },
        });
      })(n(1781));
    },
    1934: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('zh-mo', {
          months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
          monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
          weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
          weekdaysShort: '週日_週一_週二_週三_週四_週五_週六'.split('_'),
          weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'YYYY年M月D日',
            LLL: 'YYYY年M月D日 HH:mm',
            LLLL: 'YYYY年M月D日dddd HH:mm',
            l: 'D/M/YYYY',
            ll: 'YYYY年M月D日',
            lll: 'YYYY年M月D日 HH:mm',
            llll: 'YYYY年M月D日dddd HH:mm',
          },
          meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              '凌晨' === t || '早上' === t || '上午' === t
                ? e
                : '中午' === t
                ? e >= 11
                  ? e
                  : e + 12
                : '下午' === t || '晚上' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            var a = 100 * e + t;
            return a < 600
              ? '凌晨'
              : a < 900
              ? '早上'
              : a < 1130
              ? '上午'
              : a < 1230
              ? '中午'
              : a < 1800
              ? '下午'
              : '晚上';
          },
          calendar: {
            sameDay: '[今天] LT',
            nextDay: '[明天] LT',
            nextWeek: '[下]dddd LT',
            lastDay: '[昨天] LT',
            lastWeek: '[上]dddd LT',
            sameElse: 'L',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
          ordinal: function (e, t) {
            switch (t) {
              case 'd':
              case 'D':
              case 'DDD':
                return e + '日';
              case 'M':
                return e + '月';
              case 'w':
              case 'W':
                return e + '週';
              default:
                return e;
            }
          },
          relativeTime: {
            future: '%s內',
            past: '%s前',
            s: '幾秒',
            ss: '%d 秒',
            m: '1 分鐘',
            mm: '%d 分鐘',
            h: '1 小時',
            hh: '%d 小時',
            d: '1 天',
            dd: '%d 天',
            M: '1 個月',
            MM: '%d 個月',
            y: '1 年',
            yy: '%d 年',
          },
        });
      })(n(1781));
    },
    1935: function (e, t, n) {
      !(function (e) {
        'use strict';
        //! moment.js locale configuration
        e.defineLocale('zh-tw', {
          months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
          monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
          weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
          weekdaysShort: '週日_週一_週二_週三_週四_週五_週六'.split('_'),
          weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'YYYY/MM/DD',
            LL: 'YYYY年M月D日',
            LLL: 'YYYY年M月D日 HH:mm',
            LLLL: 'YYYY年M月D日dddd HH:mm',
            l: 'YYYY/M/D',
            ll: 'YYYY年M月D日',
            lll: 'YYYY年M月D日 HH:mm',
            llll: 'YYYY年M月D日dddd HH:mm',
          },
          meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
          meridiemHour: function (e, t) {
            return (
              12 === e && (e = 0),
              '凌晨' === t || '早上' === t || '上午' === t
                ? e
                : '中午' === t
                ? e >= 11
                  ? e
                  : e + 12
                : '下午' === t || '晚上' === t
                ? e + 12
                : void 0
            );
          },
          meridiem: function (e, t, n) {
            var a = 100 * e + t;
            return a < 600
              ? '凌晨'
              : a < 900
              ? '早上'
              : a < 1130
              ? '上午'
              : a < 1230
              ? '中午'
              : a < 1800
              ? '下午'
              : '晚上';
          },
          calendar: {
            sameDay: '[今天] LT',
            nextDay: '[明天] LT',
            nextWeek: '[下]dddd LT',
            lastDay: '[昨天] LT',
            lastWeek: '[上]dddd LT',
            sameElse: 'L',
          },
          dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
          ordinal: function (e, t) {
            switch (t) {
              case 'd':
              case 'D':
              case 'DDD':
                return e + '日';
              case 'M':
                return e + '月';
              case 'w':
              case 'W':
                return e + '週';
              default:
                return e;
            }
          },
          relativeTime: {
            future: '%s後',
            past: '%s前',
            s: '幾秒',
            ss: '%d 秒',
            m: '1 分鐘',
            mm: '%d 分鐘',
            h: '1 小時',
            hh: '%d 小時',
            d: '1 天',
            dd: '%d 天',
            M: '1 個月',
            MM: '%d 個月',
            y: '1 年',
            yy: '%d 年',
          },
        });
      })(n(1781));
    },
    1936: function (e, t, n) {
      var a = n(1787),
        r = n(1960),
        i = n(1961),
        s = n(1962),
        o = n(1963),
        d = n(1964);
      function l(e) {
        var t = (this.__data__ = new a(e));
        this.size = t.size;
      }
      (l.prototype.clear = r),
        (l.prototype.delete = i),
        (l.prototype.get = s),
        (l.prototype.has = o),
        (l.prototype.set = d),
        (e.exports = l);
    },
    1937: function (e, t) {
      e.exports = function (e, t) {
        return e === t || (e != e && t != t);
      };
    },
    1938: function (e, t, n) {
      var a = n(1785),
        r = n(1795);
      e.exports = function (e) {
        if (!r(e)) return !1;
        var t = a(e);
        return (
          '[object Function]' == t ||
          '[object GeneratorFunction]' == t ||
          '[object AsyncFunction]' == t ||
          '[object Proxy]' == t
        );
      };
    },
    1939: function (e, t, n) {
      (function (t) {
        var n = 'object' == typeof t && t && t.Object === Object && t;
        e.exports = n;
      }.call(this, n(16)));
    },
    1940: function (e, t) {
      var n = Function.prototype.toString;
      e.exports = function (e) {
        if (null != e) {
          try {
            return n.call(e);
          } catch (e) {}
          try {
            return e + '';
          } catch (e) {}
        }
        return '';
      };
    },
    1941: function (e, t, n) {
      var a = n(1983),
        r = n(1986),
        i = n(1987);
      e.exports = function (e, t, n, s, o, d) {
        var l = 1 & n,
          u = e.length,
          _ = t.length;
        if (u != _ && !(l && _ > u)) return !1;
        var c = d.get(e),
          h = d.get(t);
        if (c && h) return c == t && h == e;
        var m = -1,
          f = !0,
          p = 2 & n ? new a() : void 0;
        for (d.set(e, t), d.set(t, e); ++m < u; ) {
          var M = e[m],
            y = t[m];
          if (s) var g = l ? s(y, M, m, t, e, d) : s(M, y, m, e, t, d);
          if (void 0 !== g) {
            if (g) continue;
            f = !1;
            break;
          }
          if (p) {
            if (
              !r(t, function (e, t) {
                if (!i(p, t) && (M === e || o(M, e, n, s, d))) return p.push(t);
              })
            ) {
              f = !1;
              break;
            }
          } else if (M !== y && !o(M, y, n, s, d)) {
            f = !1;
            break;
          }
        }
        return d.delete(e), d.delete(t), f;
      };
    },
    1942: function (e, t, n) {
      var a = n(2001),
        r = n(1786),
        i = Object.prototype,
        s = i.hasOwnProperty,
        o = i.propertyIsEnumerable,
        d = a(
          (function () {
            return arguments;
          })(),
        )
          ? a
          : function (e) {
              return r(e) && s.call(e, 'callee') && !o.call(e, 'callee');
            };
      e.exports = d;
    },
    1943: function (e, t, n) {
      (function (e) {
        var a = n(1782),
          r = n(2002),
          i = t && !t.nodeType && t,
          s = i && 'object' == typeof e && e && !e.nodeType && e,
          o = s && s.exports === i ? a.Buffer : void 0,
          d = (o ? o.isBuffer : void 0) || r;
        e.exports = d;
      }.call(this, n(71)(e)));
    },
    1944: function (e, t) {
      var n = /^(?:0|[1-9]\d*)$/;
      e.exports = function (e, t) {
        var a = typeof e;
        return (
          !!(t = null == t ? 9007199254740991 : t) &&
          ('number' == a || ('symbol' != a && n.test(e))) &&
          e > -1 &&
          e % 1 == 0 &&
          e < t
        );
      };
    },
    1945: function (e, t, n) {
      var a = n(2003),
        r = n(2004),
        i = n(2005),
        s = i && i.isTypedArray,
        o = s ? r(s) : a;
      e.exports = o;
    },
    1946: function (e, t, n) {
      var a = n(1938),
        r = n(1798);
      e.exports = function (e) {
        return null != e && r(e.length) && !a(e);
      };
    },
    1947: function (e, t, n) {
      var a = n(1795);
      e.exports = function (e) {
        return e == e && !a(e);
      };
    },
    1948: function (e, t) {
      e.exports = function (e, t) {
        return function (n) {
          return null != n && n[e] === t && (void 0 !== t || e in Object(n));
        };
      };
    },
    1949: function (e, t, n) {
      var a = n(1950),
        r = n(1792);
      e.exports = function (e, t) {
        for (var n = 0, i = (t = a(t, e)).length; null != e && n < i; ) e = e[r(t[n++])];
        return n && n == i ? e : void 0;
      };
    },
    1950: function (e, t, n) {
      var a = n(1783),
        r = n(1799),
        i = n(2032),
        s = n(2035);
      e.exports = function (e, t) {
        return a(e) ? e : r(e, t) ? [e] : i(s(e));
      };
    },
    1951: function (e, t, n) {
      /*!
       * Chart.js v2.9.4
       * https://www.chartjs.org
       * (c) 2020 Chart.js Contributors
       * Released under the MIT License
       */
      e.exports = (function (e) {
        'use strict';
        e = e && e.hasOwnProperty('default') ? e.default : e;
        var t = {
            aliceblue: [240, 248, 255],
            antiquewhite: [250, 235, 215],
            aqua: [0, 255, 255],
            aquamarine: [127, 255, 212],
            azure: [240, 255, 255],
            beige: [245, 245, 220],
            bisque: [255, 228, 196],
            black: [0, 0, 0],
            blanchedalmond: [255, 235, 205],
            blue: [0, 0, 255],
            blueviolet: [138, 43, 226],
            brown: [165, 42, 42],
            burlywood: [222, 184, 135],
            cadetblue: [95, 158, 160],
            chartreuse: [127, 255, 0],
            chocolate: [210, 105, 30],
            coral: [255, 127, 80],
            cornflowerblue: [100, 149, 237],
            cornsilk: [255, 248, 220],
            crimson: [220, 20, 60],
            cyan: [0, 255, 255],
            darkblue: [0, 0, 139],
            darkcyan: [0, 139, 139],
            darkgoldenrod: [184, 134, 11],
            darkgray: [169, 169, 169],
            darkgreen: [0, 100, 0],
            darkgrey: [169, 169, 169],
            darkkhaki: [189, 183, 107],
            darkmagenta: [139, 0, 139],
            darkolivegreen: [85, 107, 47],
            darkorange: [255, 140, 0],
            darkorchid: [153, 50, 204],
            darkred: [139, 0, 0],
            darksalmon: [233, 150, 122],
            darkseagreen: [143, 188, 143],
            darkslateblue: [72, 61, 139],
            darkslategray: [47, 79, 79],
            darkslategrey: [47, 79, 79],
            darkturquoise: [0, 206, 209],
            darkviolet: [148, 0, 211],
            deeppink: [255, 20, 147],
            deepskyblue: [0, 191, 255],
            dimgray: [105, 105, 105],
            dimgrey: [105, 105, 105],
            dodgerblue: [30, 144, 255],
            firebrick: [178, 34, 34],
            floralwhite: [255, 250, 240],
            forestgreen: [34, 139, 34],
            fuchsia: [255, 0, 255],
            gainsboro: [220, 220, 220],
            ghostwhite: [248, 248, 255],
            gold: [255, 215, 0],
            goldenrod: [218, 165, 32],
            gray: [128, 128, 128],
            green: [0, 128, 0],
            greenyellow: [173, 255, 47],
            grey: [128, 128, 128],
            honeydew: [240, 255, 240],
            hotpink: [255, 105, 180],
            indianred: [205, 92, 92],
            indigo: [75, 0, 130],
            ivory: [255, 255, 240],
            khaki: [240, 230, 140],
            lavender: [230, 230, 250],
            lavenderblush: [255, 240, 245],
            lawngreen: [124, 252, 0],
            lemonchiffon: [255, 250, 205],
            lightblue: [173, 216, 230],
            lightcoral: [240, 128, 128],
            lightcyan: [224, 255, 255],
            lightgoldenrodyellow: [250, 250, 210],
            lightgray: [211, 211, 211],
            lightgreen: [144, 238, 144],
            lightgrey: [211, 211, 211],
            lightpink: [255, 182, 193],
            lightsalmon: [255, 160, 122],
            lightseagreen: [32, 178, 170],
            lightskyblue: [135, 206, 250],
            lightslategray: [119, 136, 153],
            lightslategrey: [119, 136, 153],
            lightsteelblue: [176, 196, 222],
            lightyellow: [255, 255, 224],
            lime: [0, 255, 0],
            limegreen: [50, 205, 50],
            linen: [250, 240, 230],
            magenta: [255, 0, 255],
            maroon: [128, 0, 0],
            mediumaquamarine: [102, 205, 170],
            mediumblue: [0, 0, 205],
            mediumorchid: [186, 85, 211],
            mediumpurple: [147, 112, 219],
            mediumseagreen: [60, 179, 113],
            mediumslateblue: [123, 104, 238],
            mediumspringgreen: [0, 250, 154],
            mediumturquoise: [72, 209, 204],
            mediumvioletred: [199, 21, 133],
            midnightblue: [25, 25, 112],
            mintcream: [245, 255, 250],
            mistyrose: [255, 228, 225],
            moccasin: [255, 228, 181],
            navajowhite: [255, 222, 173],
            navy: [0, 0, 128],
            oldlace: [253, 245, 230],
            olive: [128, 128, 0],
            olivedrab: [107, 142, 35],
            orange: [255, 165, 0],
            orangered: [255, 69, 0],
            orchid: [218, 112, 214],
            palegoldenrod: [238, 232, 170],
            palegreen: [152, 251, 152],
            paleturquoise: [175, 238, 238],
            palevioletred: [219, 112, 147],
            papayawhip: [255, 239, 213],
            peachpuff: [255, 218, 185],
            peru: [205, 133, 63],
            pink: [255, 192, 203],
            plum: [221, 160, 221],
            powderblue: [176, 224, 230],
            purple: [128, 0, 128],
            rebeccapurple: [102, 51, 153],
            red: [255, 0, 0],
            rosybrown: [188, 143, 143],
            royalblue: [65, 105, 225],
            saddlebrown: [139, 69, 19],
            salmon: [250, 128, 114],
            sandybrown: [244, 164, 96],
            seagreen: [46, 139, 87],
            seashell: [255, 245, 238],
            sienna: [160, 82, 45],
            silver: [192, 192, 192],
            skyblue: [135, 206, 235],
            slateblue: [106, 90, 205],
            slategray: [112, 128, 144],
            slategrey: [112, 128, 144],
            snow: [255, 250, 250],
            springgreen: [0, 255, 127],
            steelblue: [70, 130, 180],
            tan: [210, 180, 140],
            teal: [0, 128, 128],
            thistle: [216, 191, 216],
            tomato: [255, 99, 71],
            turquoise: [64, 224, 208],
            violet: [238, 130, 238],
            wheat: [245, 222, 179],
            white: [255, 255, 255],
            whitesmoke: [245, 245, 245],
            yellow: [255, 255, 0],
            yellowgreen: [154, 205, 50],
          },
          n = (function (e, t) {
            return e((t = { exports: {} }), t.exports), t.exports;
          })(function (e) {
            var n = {};
            for (var a in t) t.hasOwnProperty(a) && (n[t[a]] = a);
            var r = (e.exports = {
              rgb: { channels: 3, labels: 'rgb' },
              hsl: { channels: 3, labels: 'hsl' },
              hsv: { channels: 3, labels: 'hsv' },
              hwb: { channels: 3, labels: 'hwb' },
              cmyk: { channels: 4, labels: 'cmyk' },
              xyz: { channels: 3, labels: 'xyz' },
              lab: { channels: 3, labels: 'lab' },
              lch: { channels: 3, labels: 'lch' },
              hex: { channels: 1, labels: ['hex'] },
              keyword: { channels: 1, labels: ['keyword'] },
              ansi16: { channels: 1, labels: ['ansi16'] },
              ansi256: { channels: 1, labels: ['ansi256'] },
              hcg: { channels: 3, labels: ['h', 'c', 'g'] },
              apple: { channels: 3, labels: ['r16', 'g16', 'b16'] },
              gray: { channels: 1, labels: ['gray'] },
            });
            for (var i in r)
              if (r.hasOwnProperty(i)) {
                if (!('channels' in r[i])) throw new Error('missing channels property: ' + i);
                if (!('labels' in r[i])) throw new Error('missing channel labels property: ' + i);
                if (r[i].labels.length !== r[i].channels) throw new Error('channel and label counts mismatch: ' + i);
                var s = r[i].channels,
                  o = r[i].labels;
                delete r[i].channels,
                  delete r[i].labels,
                  Object.defineProperty(r[i], 'channels', { value: s }),
                  Object.defineProperty(r[i], 'labels', { value: o });
              }
            (r.rgb.hsl = function (e) {
              var t,
                n,
                a = e[0] / 255,
                r = e[1] / 255,
                i = e[2] / 255,
                s = Math.min(a, r, i),
                o = Math.max(a, r, i),
                d = o - s;
              return (
                o === s
                  ? (t = 0)
                  : a === o
                  ? (t = (r - i) / d)
                  : r === o
                  ? (t = 2 + (i - a) / d)
                  : i === o && (t = 4 + (a - r) / d),
                (t = Math.min(60 * t, 360)) < 0 && (t += 360),
                (n = (s + o) / 2),
                [t, 100 * (o === s ? 0 : n <= 0.5 ? d / (o + s) : d / (2 - o - s)), 100 * n]
              );
            }),
              (r.rgb.hsv = function (e) {
                var t,
                  n,
                  a,
                  r,
                  i,
                  s = e[0] / 255,
                  o = e[1] / 255,
                  d = e[2] / 255,
                  l = Math.max(s, o, d),
                  u = l - Math.min(s, o, d),
                  _ = function (e) {
                    return (l - e) / 6 / u + 0.5;
                  };
                return (
                  0 === u
                    ? (r = i = 0)
                    : ((i = u / l),
                      (t = _(s)),
                      (n = _(o)),
                      (a = _(d)),
                      s === l ? (r = a - n) : o === l ? (r = 1 / 3 + t - a) : d === l && (r = 2 / 3 + n - t),
                      r < 0 ? (r += 1) : r > 1 && (r -= 1)),
                  [360 * r, 100 * i, 100 * l]
                );
              }),
              (r.rgb.hwb = function (e) {
                var t = e[0],
                  n = e[1],
                  a = e[2];
                return [
                  r.rgb.hsl(e)[0],
                  (1 / 255) * Math.min(t, Math.min(n, a)) * 100,
                  100 * (a = 1 - (1 / 255) * Math.max(t, Math.max(n, a))),
                ];
              }),
              (r.rgb.cmyk = function (e) {
                var t,
                  n = e[0] / 255,
                  a = e[1] / 255,
                  r = e[2] / 255;
                return [
                  100 * ((1 - n - (t = Math.min(1 - n, 1 - a, 1 - r))) / (1 - t) || 0),
                  100 * ((1 - a - t) / (1 - t) || 0),
                  100 * ((1 - r - t) / (1 - t) || 0),
                  100 * t,
                ];
              }),
              (r.rgb.keyword = function (e) {
                var a = n[e];
                if (a) return a;
                var r,
                  i,
                  s,
                  o = 1 / 0;
                for (var d in t)
                  if (t.hasOwnProperty(d)) {
                    var l = t[d],
                      u =
                        ((i = e),
                        (s = l),
                        Math.pow(i[0] - s[0], 2) + Math.pow(i[1] - s[1], 2) + Math.pow(i[2] - s[2], 2));
                    u < o && ((o = u), (r = d));
                  }
                return r;
              }),
              (r.keyword.rgb = function (e) {
                return t[e];
              }),
              (r.rgb.xyz = function (e) {
                var t = e[0] / 255,
                  n = e[1] / 255,
                  a = e[2] / 255;
                return [
                  100 *
                    (0.4124 * (t = t > 0.04045 ? Math.pow((t + 0.055) / 1.055, 2.4) : t / 12.92) +
                      0.3576 * (n = n > 0.04045 ? Math.pow((n + 0.055) / 1.055, 2.4) : n / 12.92) +
                      0.1805 * (a = a > 0.04045 ? Math.pow((a + 0.055) / 1.055, 2.4) : a / 12.92)),
                  100 * (0.2126 * t + 0.7152 * n + 0.0722 * a),
                  100 * (0.0193 * t + 0.1192 * n + 0.9505 * a),
                ];
              }),
              (r.rgb.lab = function (e) {
                var t = r.rgb.xyz(e),
                  n = t[0],
                  a = t[1],
                  i = t[2];
                return (
                  (a /= 100),
                  (i /= 108.883),
                  (n = (n /= 95.047) > 0.008856 ? Math.pow(n, 1 / 3) : 7.787 * n + 16 / 116),
                  [
                    116 * (a = a > 0.008856 ? Math.pow(a, 1 / 3) : 7.787 * a + 16 / 116) - 16,
                    500 * (n - a),
                    200 * (a - (i = i > 0.008856 ? Math.pow(i, 1 / 3) : 7.787 * i + 16 / 116)),
                  ]
                );
              }),
              (r.hsl.rgb = function (e) {
                var t,
                  n,
                  a,
                  r,
                  i,
                  s = e[0] / 360,
                  o = e[1] / 100,
                  d = e[2] / 100;
                if (0 === o) return [(i = 255 * d), i, i];
                (t = 2 * d - (n = d < 0.5 ? d * (1 + o) : d + o - d * o)), (r = [0, 0, 0]);
                for (var l = 0; l < 3; l++)
                  (a = s + (1 / 3) * -(l - 1)) < 0 && a++,
                    a > 1 && a--,
                    (i =
                      6 * a < 1 ? t + 6 * (n - t) * a : 2 * a < 1 ? n : 3 * a < 2 ? t + (n - t) * (2 / 3 - a) * 6 : t),
                    (r[l] = 255 * i);
                return r;
              }),
              (r.hsl.hsv = function (e) {
                var t = e[0],
                  n = e[1] / 100,
                  a = e[2] / 100,
                  r = n,
                  i = Math.max(a, 0.01);
                return (
                  (n *= (a *= 2) <= 1 ? a : 2 - a),
                  (r *= i <= 1 ? i : 2 - i),
                  [t, 100 * (0 === a ? (2 * r) / (i + r) : (2 * n) / (a + n)), ((a + n) / 2) * 100]
                );
              }),
              (r.hsv.rgb = function (e) {
                var t = e[0] / 60,
                  n = e[1] / 100,
                  a = e[2] / 100,
                  r = Math.floor(t) % 6,
                  i = t - Math.floor(t),
                  s = 255 * a * (1 - n),
                  o = 255 * a * (1 - n * i),
                  d = 255 * a * (1 - n * (1 - i));
                switch (((a *= 255), r)) {
                  case 0:
                    return [a, d, s];
                  case 1:
                    return [o, a, s];
                  case 2:
                    return [s, a, d];
                  case 3:
                    return [s, o, a];
                  case 4:
                    return [d, s, a];
                  case 5:
                    return [a, s, o];
                }
              }),
              (r.hsv.hsl = function (e) {
                var t,
                  n,
                  a,
                  r = e[0],
                  i = e[1] / 100,
                  s = e[2] / 100,
                  o = Math.max(s, 0.01);
                return (
                  (a = (2 - i) * s),
                  (n = i * o),
                  [r, 100 * (n = (n /= (t = (2 - i) * o) <= 1 ? t : 2 - t) || 0), 100 * (a /= 2)]
                );
              }),
              (r.hwb.rgb = function (e) {
                var t,
                  n,
                  a,
                  r,
                  i,
                  s,
                  o,
                  d = e[0] / 360,
                  l = e[1] / 100,
                  u = e[2] / 100,
                  _ = l + u;
                switch (
                  (_ > 1 && ((l /= _), (u /= _)),
                  (a = 6 * d - (t = Math.floor(6 * d))),
                  0 != (1 & t) && (a = 1 - a),
                  (r = l + a * ((n = 1 - u) - l)),
                  t)
                ) {
                  default:
                  case 6:
                  case 0:
                    (i = n), (s = r), (o = l);
                    break;
                  case 1:
                    (i = r), (s = n), (o = l);
                    break;
                  case 2:
                    (i = l), (s = n), (o = r);
                    break;
                  case 3:
                    (i = l), (s = r), (o = n);
                    break;
                  case 4:
                    (i = r), (s = l), (o = n);
                    break;
                  case 5:
                    (i = n), (s = l), (o = r);
                }
                return [255 * i, 255 * s, 255 * o];
              }),
              (r.cmyk.rgb = function (e) {
                var t = e[0] / 100,
                  n = e[1] / 100,
                  a = e[2] / 100,
                  r = e[3] / 100;
                return [
                  255 * (1 - Math.min(1, t * (1 - r) + r)),
                  255 * (1 - Math.min(1, n * (1 - r) + r)),
                  255 * (1 - Math.min(1, a * (1 - r) + r)),
                ];
              }),
              (r.xyz.rgb = function (e) {
                var t,
                  n,
                  a,
                  r = e[0] / 100,
                  i = e[1] / 100,
                  s = e[2] / 100;
                return (
                  (n = -0.9689 * r + 1.8758 * i + 0.0415 * s),
                  (a = 0.0557 * r + -0.204 * i + 1.057 * s),
                  (t =
                    (t = 3.2406 * r + -1.5372 * i + -0.4986 * s) > 0.0031308
                      ? 1.055 * Math.pow(t, 1 / 2.4) - 0.055
                      : 12.92 * t),
                  (n = n > 0.0031308 ? 1.055 * Math.pow(n, 1 / 2.4) - 0.055 : 12.92 * n),
                  (a = a > 0.0031308 ? 1.055 * Math.pow(a, 1 / 2.4) - 0.055 : 12.92 * a),
                  [
                    255 * (t = Math.min(Math.max(0, t), 1)),
                    255 * (n = Math.min(Math.max(0, n), 1)),
                    255 * (a = Math.min(Math.max(0, a), 1)),
                  ]
                );
              }),
              (r.xyz.lab = function (e) {
                var t = e[0],
                  n = e[1],
                  a = e[2];
                return (
                  (n /= 100),
                  (a /= 108.883),
                  (t = (t /= 95.047) > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116),
                  [
                    116 * (n = n > 0.008856 ? Math.pow(n, 1 / 3) : 7.787 * n + 16 / 116) - 16,
                    500 * (t - n),
                    200 * (n - (a = a > 0.008856 ? Math.pow(a, 1 / 3) : 7.787 * a + 16 / 116)),
                  ]
                );
              }),
              (r.lab.xyz = function (e) {
                var t,
                  n,
                  a,
                  r = e[0];
                (t = e[1] / 500 + (n = (r + 16) / 116)), (a = n - e[2] / 200);
                var i = Math.pow(n, 3),
                  s = Math.pow(t, 3),
                  o = Math.pow(a, 3);
                return (
                  (n = i > 0.008856 ? i : (n - 16 / 116) / 7.787),
                  (t = s > 0.008856 ? s : (t - 16 / 116) / 7.787),
                  (a = o > 0.008856 ? o : (a - 16 / 116) / 7.787),
                  [(t *= 95.047), (n *= 100), (a *= 108.883)]
                );
              }),
              (r.lab.lch = function (e) {
                var t,
                  n = e[0],
                  a = e[1],
                  r = e[2];
                return (t = (360 * Math.atan2(r, a)) / 2 / Math.PI) < 0 && (t += 360), [n, Math.sqrt(a * a + r * r), t];
              }),
              (r.lch.lab = function (e) {
                var t,
                  n = e[0],
                  a = e[1];
                return (t = (e[2] / 360) * 2 * Math.PI), [n, a * Math.cos(t), a * Math.sin(t)];
              }),
              (r.rgb.ansi16 = function (e) {
                var t = e[0],
                  n = e[1],
                  a = e[2],
                  i = 1 in arguments ? arguments[1] : r.rgb.hsv(e)[2];
                if (0 === (i = Math.round(i / 50))) return 30;
                var s = 30 + ((Math.round(a / 255) << 2) | (Math.round(n / 255) << 1) | Math.round(t / 255));
                return 2 === i && (s += 60), s;
              }),
              (r.hsv.ansi16 = function (e) {
                return r.rgb.ansi16(r.hsv.rgb(e), e[2]);
              }),
              (r.rgb.ansi256 = function (e) {
                var t = e[0],
                  n = e[1],
                  a = e[2];
                return t === n && n === a
                  ? t < 8
                    ? 16
                    : t > 248
                    ? 231
                    : Math.round(((t - 8) / 247) * 24) + 232
                  : 16 + 36 * Math.round((t / 255) * 5) + 6 * Math.round((n / 255) * 5) + Math.round((a / 255) * 5);
              }),
              (r.ansi16.rgb = function (e) {
                var t = e % 10;
                if (0 === t || 7 === t) return e > 50 && (t += 3.5), [(t = (t / 10.5) * 255), t, t];
                var n = 0.5 * (1 + ~~(e > 50));
                return [(1 & t) * n * 255, ((t >> 1) & 1) * n * 255, ((t >> 2) & 1) * n * 255];
              }),
              (r.ansi256.rgb = function (e) {
                if (e >= 232) {
                  var t = 10 * (e - 232) + 8;
                  return [t, t, t];
                }
                var n;
                return (
                  (e -= 16),
                  [(Math.floor(e / 36) / 5) * 255, (Math.floor((n = e % 36) / 6) / 5) * 255, ((n % 6) / 5) * 255]
                );
              }),
              (r.rgb.hex = function (e) {
                var t = (((255 & Math.round(e[0])) << 16) + ((255 & Math.round(e[1])) << 8) + (255 & Math.round(e[2])))
                  .toString(16)
                  .toUpperCase();
                return '000000'.substring(t.length) + t;
              }),
              (r.hex.rgb = function (e) {
                var t = e.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
                if (!t) return [0, 0, 0];
                var n = t[0];
                3 === t[0].length &&
                  (n = n
                    .split('')
                    .map(function (e) {
                      return e + e;
                    })
                    .join(''));
                var a = parseInt(n, 16);
                return [(a >> 16) & 255, (a >> 8) & 255, 255 & a];
              }),
              (r.rgb.hcg = function (e) {
                var t,
                  n = e[0] / 255,
                  a = e[1] / 255,
                  r = e[2] / 255,
                  i = Math.max(Math.max(n, a), r),
                  s = Math.min(Math.min(n, a), r),
                  o = i - s;
                return (
                  (t = o <= 0 ? 0 : i === n ? ((a - r) / o) % 6 : i === a ? 2 + (r - n) / o : 4 + (n - a) / o + 4),
                  (t /= 6),
                  [360 * (t %= 1), 100 * o, 100 * (o < 1 ? s / (1 - o) : 0)]
                );
              }),
              (r.hsl.hcg = function (e) {
                var t = e[1] / 100,
                  n = e[2] / 100,
                  a = 1,
                  r = 0;
                return (
                  (a = n < 0.5 ? 2 * t * n : 2 * t * (1 - n)) < 1 && (r = (n - 0.5 * a) / (1 - a)),
                  [e[0], 100 * a, 100 * r]
                );
              }),
              (r.hsv.hcg = function (e) {
                var t = e[1] / 100,
                  n = e[2] / 100,
                  a = t * n,
                  r = 0;
                return a < 1 && (r = (n - a) / (1 - a)), [e[0], 100 * a, 100 * r];
              }),
              (r.hcg.rgb = function (e) {
                var t = e[0] / 360,
                  n = e[1] / 100,
                  a = e[2] / 100;
                if (0 === n) return [255 * a, 255 * a, 255 * a];
                var r,
                  i = [0, 0, 0],
                  s = (t % 1) * 6,
                  o = s % 1,
                  d = 1 - o;
                switch (Math.floor(s)) {
                  case 0:
                    (i[0] = 1), (i[1] = o), (i[2] = 0);
                    break;
                  case 1:
                    (i[0] = d), (i[1] = 1), (i[2] = 0);
                    break;
                  case 2:
                    (i[0] = 0), (i[1] = 1), (i[2] = o);
                    break;
                  case 3:
                    (i[0] = 0), (i[1] = d), (i[2] = 1);
                    break;
                  case 4:
                    (i[0] = o), (i[1] = 0), (i[2] = 1);
                    break;
                  default:
                    (i[0] = 1), (i[1] = 0), (i[2] = d);
                }
                return (r = (1 - n) * a), [255 * (n * i[0] + r), 255 * (n * i[1] + r), 255 * (n * i[2] + r)];
              }),
              (r.hcg.hsv = function (e) {
                var t = e[1] / 100,
                  n = t + (e[2] / 100) * (1 - t),
                  a = 0;
                return n > 0 && (a = t / n), [e[0], 100 * a, 100 * n];
              }),
              (r.hcg.hsl = function (e) {
                var t = e[1] / 100,
                  n = (e[2] / 100) * (1 - t) + 0.5 * t,
                  a = 0;
                return (
                  n > 0 && n < 0.5 ? (a = t / (2 * n)) : n >= 0.5 && n < 1 && (a = t / (2 * (1 - n))),
                  [e[0], 100 * a, 100 * n]
                );
              }),
              (r.hcg.hwb = function (e) {
                var t = e[1] / 100,
                  n = t + (e[2] / 100) * (1 - t);
                return [e[0], 100 * (n - t), 100 * (1 - n)];
              }),
              (r.hwb.hcg = function (e) {
                var t = e[1] / 100,
                  n = 1 - e[2] / 100,
                  a = n - t,
                  r = 0;
                return a < 1 && (r = (n - a) / (1 - a)), [e[0], 100 * a, 100 * r];
              }),
              (r.apple.rgb = function (e) {
                return [(e[0] / 65535) * 255, (e[1] / 65535) * 255, (e[2] / 65535) * 255];
              }),
              (r.rgb.apple = function (e) {
                return [(e[0] / 255) * 65535, (e[1] / 255) * 65535, (e[2] / 255) * 65535];
              }),
              (r.gray.rgb = function (e) {
                return [(e[0] / 100) * 255, (e[0] / 100) * 255, (e[0] / 100) * 255];
              }),
              (r.gray.hsl = r.gray.hsv =
                function (e) {
                  return [0, 0, e[0]];
                }),
              (r.gray.hwb = function (e) {
                return [0, 100, e[0]];
              }),
              (r.gray.cmyk = function (e) {
                return [0, 0, 0, e[0]];
              }),
              (r.gray.lab = function (e) {
                return [e[0], 0, 0];
              }),
              (r.gray.hex = function (e) {
                var t = 255 & Math.round((e[0] / 100) * 255),
                  n = ((t << 16) + (t << 8) + t).toString(16).toUpperCase();
                return '000000'.substring(n.length) + n;
              }),
              (r.rgb.gray = function (e) {
                return [((e[0] + e[1] + e[2]) / 3 / 255) * 100];
              });
          });
        function a(e) {
          var t = (function () {
              for (var e = {}, t = Object.keys(n), a = t.length, r = 0; r < a; r++)
                e[t[r]] = { distance: -1, parent: null };
              return e;
            })(),
            a = [e];
          for (t[e].distance = 0; a.length; )
            for (var r = a.pop(), i = Object.keys(n[r]), s = i.length, o = 0; o < s; o++) {
              var d = i[o],
                l = t[d];
              -1 === l.distance && ((l.distance = t[r].distance + 1), (l.parent = r), a.unshift(d));
            }
          return t;
        }
        function r(e, t) {
          return function (n) {
            return t(e(n));
          };
        }
        function i(e, t) {
          for (var a = [t[e].parent, e], i = n[t[e].parent][e], s = t[e].parent; t[s].parent; )
            a.unshift(t[s].parent), (i = r(n[t[s].parent][s], i)), (s = t[s].parent);
          return (i.conversion = a), i;
        }
        n.rgb,
          n.hsl,
          n.hsv,
          n.hwb,
          n.cmyk,
          n.xyz,
          n.lab,
          n.lch,
          n.hex,
          n.keyword,
          n.ansi16,
          n.ansi256,
          n.hcg,
          n.apple,
          n.gray;
        var s = {};
        Object.keys(n).forEach(function (e) {
          (s[e] = {}),
            Object.defineProperty(s[e], 'channels', { value: n[e].channels }),
            Object.defineProperty(s[e], 'labels', { value: n[e].labels });
          var t = (function (e) {
            for (var t = a(e), n = {}, r = Object.keys(t), s = r.length, o = 0; o < s; o++) {
              var d = r[o];
              null !== t[d].parent && (n[d] = i(d, t));
            }
            return n;
          })(e);
          Object.keys(t).forEach(function (n) {
            var a = t[n];
            (s[e][n] = (function (e) {
              var t = function (t) {
                if (null == t) return t;
                arguments.length > 1 && (t = Array.prototype.slice.call(arguments));
                var n = e(t);
                if ('object' == typeof n) for (var a = n.length, r = 0; r < a; r++) n[r] = Math.round(n[r]);
                return n;
              };
              return 'conversion' in e && (t.conversion = e.conversion), t;
            })(a)),
              (s[e][n].raw = (function (e) {
                var t = function (t) {
                  return null == t ? t : (arguments.length > 1 && (t = Array.prototype.slice.call(arguments)), e(t));
                };
                return 'conversion' in e && (t.conversion = e.conversion), t;
              })(a));
          });
        });
        var o = s,
          d = {
            aliceblue: [240, 248, 255],
            antiquewhite: [250, 235, 215],
            aqua: [0, 255, 255],
            aquamarine: [127, 255, 212],
            azure: [240, 255, 255],
            beige: [245, 245, 220],
            bisque: [255, 228, 196],
            black: [0, 0, 0],
            blanchedalmond: [255, 235, 205],
            blue: [0, 0, 255],
            blueviolet: [138, 43, 226],
            brown: [165, 42, 42],
            burlywood: [222, 184, 135],
            cadetblue: [95, 158, 160],
            chartreuse: [127, 255, 0],
            chocolate: [210, 105, 30],
            coral: [255, 127, 80],
            cornflowerblue: [100, 149, 237],
            cornsilk: [255, 248, 220],
            crimson: [220, 20, 60],
            cyan: [0, 255, 255],
            darkblue: [0, 0, 139],
            darkcyan: [0, 139, 139],
            darkgoldenrod: [184, 134, 11],
            darkgray: [169, 169, 169],
            darkgreen: [0, 100, 0],
            darkgrey: [169, 169, 169],
            darkkhaki: [189, 183, 107],
            darkmagenta: [139, 0, 139],
            darkolivegreen: [85, 107, 47],
            darkorange: [255, 140, 0],
            darkorchid: [153, 50, 204],
            darkred: [139, 0, 0],
            darksalmon: [233, 150, 122],
            darkseagreen: [143, 188, 143],
            darkslateblue: [72, 61, 139],
            darkslategray: [47, 79, 79],
            darkslategrey: [47, 79, 79],
            darkturquoise: [0, 206, 209],
            darkviolet: [148, 0, 211],
            deeppink: [255, 20, 147],
            deepskyblue: [0, 191, 255],
            dimgray: [105, 105, 105],
            dimgrey: [105, 105, 105],
            dodgerblue: [30, 144, 255],
            firebrick: [178, 34, 34],
            floralwhite: [255, 250, 240],
            forestgreen: [34, 139, 34],
            fuchsia: [255, 0, 255],
            gainsboro: [220, 220, 220],
            ghostwhite: [248, 248, 255],
            gold: [255, 215, 0],
            goldenrod: [218, 165, 32],
            gray: [128, 128, 128],
            green: [0, 128, 0],
            greenyellow: [173, 255, 47],
            grey: [128, 128, 128],
            honeydew: [240, 255, 240],
            hotpink: [255, 105, 180],
            indianred: [205, 92, 92],
            indigo: [75, 0, 130],
            ivory: [255, 255, 240],
            khaki: [240, 230, 140],
            lavender: [230, 230, 250],
            lavenderblush: [255, 240, 245],
            lawngreen: [124, 252, 0],
            lemonchiffon: [255, 250, 205],
            lightblue: [173, 216, 230],
            lightcoral: [240, 128, 128],
            lightcyan: [224, 255, 255],
            lightgoldenrodyellow: [250, 250, 210],
            lightgray: [211, 211, 211],
            lightgreen: [144, 238, 144],
            lightgrey: [211, 211, 211],
            lightpink: [255, 182, 193],
            lightsalmon: [255, 160, 122],
            lightseagreen: [32, 178, 170],
            lightskyblue: [135, 206, 250],
            lightslategray: [119, 136, 153],
            lightslategrey: [119, 136, 153],
            lightsteelblue: [176, 196, 222],
            lightyellow: [255, 255, 224],
            lime: [0, 255, 0],
            limegreen: [50, 205, 50],
            linen: [250, 240, 230],
            magenta: [255, 0, 255],
            maroon: [128, 0, 0],
            mediumaquamarine: [102, 205, 170],
            mediumblue: [0, 0, 205],
            mediumorchid: [186, 85, 211],
            mediumpurple: [147, 112, 219],
            mediumseagreen: [60, 179, 113],
            mediumslateblue: [123, 104, 238],
            mediumspringgreen: [0, 250, 154],
            mediumturquoise: [72, 209, 204],
            mediumvioletred: [199, 21, 133],
            midnightblue: [25, 25, 112],
            mintcream: [245, 255, 250],
            mistyrose: [255, 228, 225],
            moccasin: [255, 228, 181],
            navajowhite: [255, 222, 173],
            navy: [0, 0, 128],
            oldlace: [253, 245, 230],
            olive: [128, 128, 0],
            olivedrab: [107, 142, 35],
            orange: [255, 165, 0],
            orangered: [255, 69, 0],
            orchid: [218, 112, 214],
            palegoldenrod: [238, 232, 170],
            palegreen: [152, 251, 152],
            paleturquoise: [175, 238, 238],
            palevioletred: [219, 112, 147],
            papayawhip: [255, 239, 213],
            peachpuff: [255, 218, 185],
            peru: [205, 133, 63],
            pink: [255, 192, 203],
            plum: [221, 160, 221],
            powderblue: [176, 224, 230],
            purple: [128, 0, 128],
            rebeccapurple: [102, 51, 153],
            red: [255, 0, 0],
            rosybrown: [188, 143, 143],
            royalblue: [65, 105, 225],
            saddlebrown: [139, 69, 19],
            salmon: [250, 128, 114],
            sandybrown: [244, 164, 96],
            seagreen: [46, 139, 87],
            seashell: [255, 245, 238],
            sienna: [160, 82, 45],
            silver: [192, 192, 192],
            skyblue: [135, 206, 235],
            slateblue: [106, 90, 205],
            slategray: [112, 128, 144],
            slategrey: [112, 128, 144],
            snow: [255, 250, 250],
            springgreen: [0, 255, 127],
            steelblue: [70, 130, 180],
            tan: [210, 180, 140],
            teal: [0, 128, 128],
            thistle: [216, 191, 216],
            tomato: [255, 99, 71],
            turquoise: [64, 224, 208],
            violet: [238, 130, 238],
            wheat: [245, 222, 179],
            white: [255, 255, 255],
            whitesmoke: [245, 245, 245],
            yellow: [255, 255, 0],
            yellowgreen: [154, 205, 50],
          },
          l = {
            getRgba: u,
            getHsla: _,
            getRgb: function (e) {
              var t = u(e);
              return t && t.slice(0, 3);
            },
            getHsl: function (e) {
              var t = _(e);
              return t && t.slice(0, 3);
            },
            getHwb: c,
            getAlpha: function (e) {
              var t = u(e);
              return t || (t = _(e)) || (t = c(e)) ? t[3] : void 0;
            },
            hexString: function (e, t) {
              return (
                (t = void 0 !== t && 3 === e.length ? t : e[3]),
                '#' + M(e[0]) + M(e[1]) + M(e[2]) + (t >= 0 && t < 1 ? M(Math.round(255 * t)) : '')
              );
            },
            rgbString: function (e, t) {
              return t < 1 || (e[3] && e[3] < 1) ? h(e, t) : 'rgb(' + e[0] + ', ' + e[1] + ', ' + e[2] + ')';
            },
            rgbaString: h,
            percentString: function (e, t) {
              if (t < 1 || (e[3] && e[3] < 1)) return m(e, t);
              var n = Math.round((e[0] / 255) * 100),
                a = Math.round((e[1] / 255) * 100),
                r = Math.round((e[2] / 255) * 100);
              return 'rgb(' + n + '%, ' + a + '%, ' + r + '%)';
            },
            percentaString: m,
            hslString: function (e, t) {
              return t < 1 || (e[3] && e[3] < 1) ? f(e, t) : 'hsl(' + e[0] + ', ' + e[1] + '%, ' + e[2] + '%)';
            },
            hslaString: f,
            hwbString: function (e, t) {
              return (
                void 0 === t && (t = void 0 !== e[3] ? e[3] : 1),
                'hwb(' + e[0] + ', ' + e[1] + '%, ' + e[2] + '%' + (void 0 !== t && 1 !== t ? ', ' + t : '') + ')'
              );
            },
            keyword: function (e) {
              return y[e.slice(0, 3)];
            },
          };
        function u(e) {
          if (e) {
            var t = [0, 0, 0],
              n = 1,
              a = e.match(/^#([a-fA-F0-9]{3,4})$/i),
              r = '';
            if (a) {
              r = (a = a[1])[3];
              for (var i = 0; i < t.length; i++) t[i] = parseInt(a[i] + a[i], 16);
              r && (n = Math.round((parseInt(r + r, 16) / 255) * 100) / 100);
            } else if ((a = e.match(/^#([a-fA-F0-9]{6}([a-fA-F0-9]{2})?)$/i))) {
              for (r = a[2], a = a[1], i = 0; i < t.length; i++) t[i] = parseInt(a.slice(2 * i, 2 * i + 2), 16);
              r && (n = Math.round((parseInt(r, 16) / 255) * 100) / 100);
            } else if (
              (a = e.match(/^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i))
            ) {
              for (i = 0; i < t.length; i++) t[i] = parseInt(a[i + 1]);
              n = parseFloat(a[4]);
            } else if (
              (a = e.match(
                /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,
              ))
            ) {
              for (i = 0; i < t.length; i++) t[i] = Math.round(2.55 * parseFloat(a[i + 1]));
              n = parseFloat(a[4]);
            } else if ((a = e.match(/(\w+)/))) {
              if ('transparent' == a[1]) return [0, 0, 0, 0];
              if (!(t = d[a[1]])) return;
            }
            for (i = 0; i < t.length; i++) t[i] = p(t[i], 0, 255);
            return (n = n || 0 == n ? p(n, 0, 1) : 1), (t[3] = n), t;
          }
        }
        function _(e) {
          if (e) {
            var t = e.match(
              /^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/,
            );
            if (t) {
              var n = parseFloat(t[4]);
              return [
                p(parseInt(t[1]), 0, 360),
                p(parseFloat(t[2]), 0, 100),
                p(parseFloat(t[3]), 0, 100),
                p(isNaN(n) ? 1 : n, 0, 1),
              ];
            }
          }
        }
        function c(e) {
          if (e) {
            var t = e.match(
              /^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/,
            );
            if (t) {
              var n = parseFloat(t[4]);
              return [
                p(parseInt(t[1]), 0, 360),
                p(parseFloat(t[2]), 0, 100),
                p(parseFloat(t[3]), 0, 100),
                p(isNaN(n) ? 1 : n, 0, 1),
              ];
            }
          }
        }
        function h(e, t) {
          return (
            void 0 === t && (t = void 0 !== e[3] ? e[3] : 1),
            'rgba(' + e[0] + ', ' + e[1] + ', ' + e[2] + ', ' + t + ')'
          );
        }
        function m(e, t) {
          return (
            'rgba(' +
            Math.round((e[0] / 255) * 100) +
            '%, ' +
            Math.round((e[1] / 255) * 100) +
            '%, ' +
            Math.round((e[2] / 255) * 100) +
            '%, ' +
            (t || e[3] || 1) +
            ')'
          );
        }
        function f(e, t) {
          return (
            void 0 === t && (t = void 0 !== e[3] ? e[3] : 1),
            'hsla(' + e[0] + ', ' + e[1] + '%, ' + e[2] + '%, ' + t + ')'
          );
        }
        function p(e, t, n) {
          return Math.min(Math.max(t, e), n);
        }
        function M(e) {
          var t = e.toString(16).toUpperCase();
          return t.length < 2 ? '0' + t : t;
        }
        var y = {};
        for (var g in d) y[d[g]] = g;
        var L = function (e) {
          return e instanceof L
            ? e
            : this instanceof L
            ? ((this.valid = !1),
              (this.values = {
                rgb: [0, 0, 0],
                hsl: [0, 0, 0],
                hsv: [0, 0, 0],
                hwb: [0, 0, 0],
                cmyk: [0, 0, 0, 0],
                alpha: 1,
              }),
              void ('string' == typeof e
                ? (t = l.getRgba(e))
                  ? this.setValues('rgb', t)
                  : (t = l.getHsla(e))
                  ? this.setValues('hsl', t)
                  : (t = l.getHwb(e)) && this.setValues('hwb', t)
                : 'object' == typeof e &&
                  (void 0 !== (t = e).r || void 0 !== t.red
                    ? this.setValues('rgb', t)
                    : void 0 !== t.l || void 0 !== t.lightness
                    ? this.setValues('hsl', t)
                    : void 0 !== t.v || void 0 !== t.value
                    ? this.setValues('hsv', t)
                    : void 0 !== t.w || void 0 !== t.whiteness
                    ? this.setValues('hwb', t)
                    : (void 0 === t.c && void 0 === t.cyan) || this.setValues('cmyk', t))))
            : new L(e);
          var t;
        };
        (L.prototype = {
          isValid: function () {
            return this.valid;
          },
          rgb: function () {
            return this.setSpace('rgb', arguments);
          },
          hsl: function () {
            return this.setSpace('hsl', arguments);
          },
          hsv: function () {
            return this.setSpace('hsv', arguments);
          },
          hwb: function () {
            return this.setSpace('hwb', arguments);
          },
          cmyk: function () {
            return this.setSpace('cmyk', arguments);
          },
          rgbArray: function () {
            return this.values.rgb;
          },
          hslArray: function () {
            return this.values.hsl;
          },
          hsvArray: function () {
            return this.values.hsv;
          },
          hwbArray: function () {
            var e = this.values;
            return 1 !== e.alpha ? e.hwb.concat([e.alpha]) : e.hwb;
          },
          cmykArray: function () {
            return this.values.cmyk;
          },
          rgbaArray: function () {
            var e = this.values;
            return e.rgb.concat([e.alpha]);
          },
          hslaArray: function () {
            var e = this.values;
            return e.hsl.concat([e.alpha]);
          },
          alpha: function (e) {
            return void 0 === e ? this.values.alpha : (this.setValues('alpha', e), this);
          },
          red: function (e) {
            return this.setChannel('rgb', 0, e);
          },
          green: function (e) {
            return this.setChannel('rgb', 1, e);
          },
          blue: function (e) {
            return this.setChannel('rgb', 2, e);
          },
          hue: function (e) {
            return e && (e = (e %= 360) < 0 ? 360 + e : e), this.setChannel('hsl', 0, e);
          },
          saturation: function (e) {
            return this.setChannel('hsl', 1, e);
          },
          lightness: function (e) {
            return this.setChannel('hsl', 2, e);
          },
          saturationv: function (e) {
            return this.setChannel('hsv', 1, e);
          },
          whiteness: function (e) {
            return this.setChannel('hwb', 1, e);
          },
          blackness: function (e) {
            return this.setChannel('hwb', 2, e);
          },
          value: function (e) {
            return this.setChannel('hsv', 2, e);
          },
          cyan: function (e) {
            return this.setChannel('cmyk', 0, e);
          },
          magenta: function (e) {
            return this.setChannel('cmyk', 1, e);
          },
          yellow: function (e) {
            return this.setChannel('cmyk', 2, e);
          },
          black: function (e) {
            return this.setChannel('cmyk', 3, e);
          },
          hexString: function () {
            return l.hexString(this.values.rgb);
          },
          rgbString: function () {
            return l.rgbString(this.values.rgb, this.values.alpha);
          },
          rgbaString: function () {
            return l.rgbaString(this.values.rgb, this.values.alpha);
          },
          percentString: function () {
            return l.percentString(this.values.rgb, this.values.alpha);
          },
          hslString: function () {
            return l.hslString(this.values.hsl, this.values.alpha);
          },
          hslaString: function () {
            return l.hslaString(this.values.hsl, this.values.alpha);
          },
          hwbString: function () {
            return l.hwbString(this.values.hwb, this.values.alpha);
          },
          keyword: function () {
            return l.keyword(this.values.rgb, this.values.alpha);
          },
          rgbNumber: function () {
            var e = this.values.rgb;
            return (e[0] << 16) | (e[1] << 8) | e[2];
          },
          luminosity: function () {
            for (var e = this.values.rgb, t = [], n = 0; n < e.length; n++) {
              var a = e[n] / 255;
              t[n] = a <= 0.03928 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
            }
            return 0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2];
          },
          contrast: function (e) {
            var t = this.luminosity(),
              n = e.luminosity();
            return t > n ? (t + 0.05) / (n + 0.05) : (n + 0.05) / (t + 0.05);
          },
          level: function (e) {
            var t = this.contrast(e);
            return t >= 7.1 ? 'AAA' : t >= 4.5 ? 'AA' : '';
          },
          dark: function () {
            var e = this.values.rgb;
            return (299 * e[0] + 587 * e[1] + 114 * e[2]) / 1e3 < 128;
          },
          light: function () {
            return !this.dark();
          },
          negate: function () {
            for (var e = [], t = 0; t < 3; t++) e[t] = 255 - this.values.rgb[t];
            return this.setValues('rgb', e), this;
          },
          lighten: function (e) {
            var t = this.values.hsl;
            return (t[2] += t[2] * e), this.setValues('hsl', t), this;
          },
          darken: function (e) {
            var t = this.values.hsl;
            return (t[2] -= t[2] * e), this.setValues('hsl', t), this;
          },
          saturate: function (e) {
            var t = this.values.hsl;
            return (t[1] += t[1] * e), this.setValues('hsl', t), this;
          },
          desaturate: function (e) {
            var t = this.values.hsl;
            return (t[1] -= t[1] * e), this.setValues('hsl', t), this;
          },
          whiten: function (e) {
            var t = this.values.hwb;
            return (t[1] += t[1] * e), this.setValues('hwb', t), this;
          },
          blacken: function (e) {
            var t = this.values.hwb;
            return (t[2] += t[2] * e), this.setValues('hwb', t), this;
          },
          greyscale: function () {
            var e = this.values.rgb,
              t = 0.3 * e[0] + 0.59 * e[1] + 0.11 * e[2];
            return this.setValues('rgb', [t, t, t]), this;
          },
          clearer: function (e) {
            var t = this.values.alpha;
            return this.setValues('alpha', t - t * e), this;
          },
          opaquer: function (e) {
            var t = this.values.alpha;
            return this.setValues('alpha', t + t * e), this;
          },
          rotate: function (e) {
            var t = this.values.hsl,
              n = (t[0] + e) % 360;
            return (t[0] = n < 0 ? 360 + n : n), this.setValues('hsl', t), this;
          },
          mix: function (e, t) {
            var n = e,
              a = void 0 === t ? 0.5 : t,
              r = 2 * a - 1,
              i = this.alpha() - n.alpha(),
              s = ((r * i == -1 ? r : (r + i) / (1 + r * i)) + 1) / 2,
              o = 1 - s;
            return this.rgb(
              s * this.red() + o * n.red(),
              s * this.green() + o * n.green(),
              s * this.blue() + o * n.blue(),
            ).alpha(this.alpha() * a + n.alpha() * (1 - a));
          },
          toJSON: function () {
            return this.rgb();
          },
          clone: function () {
            var e,
              t,
              n = new L(),
              a = this.values,
              r = n.values;
            for (var i in a)
              a.hasOwnProperty(i) &&
                ((e = a[i]),
                '[object Array]' === (t = {}.toString.call(e))
                  ? (r[i] = e.slice(0))
                  : '[object Number]' === t
                  ? (r[i] = e)
                  : console.error('unexpected color value:', e));
            return n;
          },
        }),
          (L.prototype.spaces = {
            rgb: ['red', 'green', 'blue'],
            hsl: ['hue', 'saturation', 'lightness'],
            hsv: ['hue', 'saturation', 'value'],
            hwb: ['hue', 'whiteness', 'blackness'],
            cmyk: ['cyan', 'magenta', 'yellow', 'black'],
          }),
          (L.prototype.maxes = {
            rgb: [255, 255, 255],
            hsl: [360, 100, 100],
            hsv: [360, 100, 100],
            hwb: [360, 100, 100],
            cmyk: [100, 100, 100, 100],
          }),
          (L.prototype.getValues = function (e) {
            for (var t = this.values, n = {}, a = 0; a < e.length; a++) n[e.charAt(a)] = t[e][a];
            return 1 !== t.alpha && (n.a = t.alpha), n;
          }),
          (L.prototype.setValues = function (e, t) {
            var n,
              a,
              r = this.values,
              i = this.spaces,
              s = this.maxes,
              d = 1;
            if (((this.valid = !0), 'alpha' === e)) d = t;
            else if (t.length) (r[e] = t.slice(0, e.length)), (d = t[e.length]);
            else if (void 0 !== t[e.charAt(0)]) {
              for (n = 0; n < e.length; n++) r[e][n] = t[e.charAt(n)];
              d = t.a;
            } else if (void 0 !== t[i[e][0]]) {
              var l = i[e];
              for (n = 0; n < e.length; n++) r[e][n] = t[l[n]];
              d = t.alpha;
            }
            if (((r.alpha = Math.max(0, Math.min(1, void 0 === d ? r.alpha : d))), 'alpha' === e)) return !1;
            for (n = 0; n < e.length; n++) (a = Math.max(0, Math.min(s[e][n], r[e][n]))), (r[e][n] = Math.round(a));
            for (var u in i) u !== e && (r[u] = o[e][u](r[e]));
            return !0;
          }),
          (L.prototype.setSpace = function (e, t) {
            var n = t[0];
            return void 0 === n
              ? this.getValues(e)
              : ('number' == typeof n && (n = Array.prototype.slice.call(t)), this.setValues(e, n), this);
          }),
          (L.prototype.setChannel = function (e, t, n) {
            var a = this.values[e];
            return void 0 === n ? a[t] : (n === a[t] || ((a[t] = n), this.setValues(e, a)), this);
          }),
          'undefined' != typeof window && (window.Color = L);
        var v = L;
        function Y(e) {
          return -1 === ['__proto__', 'prototype', 'constructor'].indexOf(e);
        }
        var b,
          k = {
            noop: function () {},
            uid:
              ((b = 0),
              function () {
                return b++;
              }),
            isNullOrUndef: function (e) {
              return null == e;
            },
            isArray: function (e) {
              if (Array.isArray && Array.isArray(e)) return !0;
              var t = Object.prototype.toString.call(e);
              return '[object' === t.substr(0, 7) && 'Array]' === t.substr(-6);
            },
            isObject: function (e) {
              return null !== e && '[object Object]' === Object.prototype.toString.call(e);
            },
            isFinite: function (e) {
              return ('number' == typeof e || e instanceof Number) && isFinite(e);
            },
            valueOrDefault: function (e, t) {
              return void 0 === e ? t : e;
            },
            valueAtIndexOrDefault: function (e, t, n) {
              return k.valueOrDefault(k.isArray(e) ? e[t] : e, n);
            },
            callback: function (e, t, n) {
              if (e && 'function' == typeof e.call) return e.apply(n, t);
            },
            each: function (e, t, n, a) {
              var r, i, s;
              if (k.isArray(e))
                if (((i = e.length), a)) for (r = i - 1; r >= 0; r--) t.call(n, e[r], r);
                else for (r = 0; r < i; r++) t.call(n, e[r], r);
              else if (k.isObject(e)) for (i = (s = Object.keys(e)).length, r = 0; r < i; r++) t.call(n, e[s[r]], s[r]);
            },
            arrayEquals: function (e, t) {
              var n, a, r, i;
              if (!e || !t || e.length !== t.length) return !1;
              for (n = 0, a = e.length; n < a; ++n)
                if (((r = e[n]), (i = t[n]), r instanceof Array && i instanceof Array)) {
                  if (!k.arrayEquals(r, i)) return !1;
                } else if (r !== i) return !1;
              return !0;
            },
            clone: function (e) {
              if (k.isArray(e)) return e.map(k.clone);
              if (k.isObject(e)) {
                for (var t = Object.create(e), n = Object.keys(e), a = n.length, r = 0; r < a; ++r)
                  t[n[r]] = k.clone(e[n[r]]);
                return t;
              }
              return e;
            },
            _merger: function (e, t, n, a) {
              if (Y(e)) {
                var r = t[e],
                  i = n[e];
                k.isObject(r) && k.isObject(i) ? k.merge(r, i, a) : (t[e] = k.clone(i));
              }
            },
            _mergerIf: function (e, t, n) {
              if (Y(e)) {
                var a = t[e],
                  r = n[e];
                k.isObject(a) && k.isObject(r) ? k.mergeIf(a, r) : t.hasOwnProperty(e) || (t[e] = k.clone(r));
              }
            },
            merge: function (e, t, n) {
              var a,
                r,
                i,
                s,
                o,
                d = k.isArray(t) ? t : [t],
                l = d.length;
              if (!k.isObject(e)) return e;
              for (a = (n = n || {}).merger || k._merger, r = 0; r < l; ++r)
                if (((t = d[r]), k.isObject(t)))
                  for (o = 0, s = (i = Object.keys(t)).length; o < s; ++o) a(i[o], e, t, n);
              return e;
            },
            mergeIf: function (e, t) {
              return k.merge(e, t, { merger: k._mergerIf });
            },
            extend:
              Object.assign ||
              function (e) {
                return k.merge(e, [].slice.call(arguments, 1), {
                  merger: function (e, t, n) {
                    t[e] = n[e];
                  },
                });
              },
            inherits: function (e) {
              var t = this,
                n =
                  e && e.hasOwnProperty('constructor')
                    ? e.constructor
                    : function () {
                        return t.apply(this, arguments);
                      },
                a = function () {
                  this.constructor = n;
                };
              return (
                (a.prototype = t.prototype),
                (n.prototype = new a()),
                (n.extend = k.inherits),
                e && k.extend(n.prototype, e),
                (n.__super__ = t.prototype),
                n
              );
            },
            _deprecated: function (e, t, n, a) {
              void 0 !== t && console.warn(e + ': "' + n + '" is deprecated. Please use "' + a + '" instead');
            },
          },
          D = k;
        (k.callCallback = k.callback),
          (k.indexOf = function (e, t, n) {
            return Array.prototype.indexOf.call(e, t, n);
          }),
          (k.getValueOrDefault = k.valueOrDefault),
          (k.getValueAtIndexOrDefault = k.valueAtIndexOrDefault);
        var w = {
            linear: function (e) {
              return e;
            },
            easeInQuad: function (e) {
              return e * e;
            },
            easeOutQuad: function (e) {
              return -e * (e - 2);
            },
            easeInOutQuad: function (e) {
              return (e /= 0.5) < 1 ? 0.5 * e * e : -0.5 * (--e * (e - 2) - 1);
            },
            easeInCubic: function (e) {
              return e * e * e;
            },
            easeOutCubic: function (e) {
              return (e -= 1) * e * e + 1;
            },
            easeInOutCubic: function (e) {
              return (e /= 0.5) < 1 ? 0.5 * e * e * e : 0.5 * ((e -= 2) * e * e + 2);
            },
            easeInQuart: function (e) {
              return e * e * e * e;
            },
            easeOutQuart: function (e) {
              return -((e -= 1) * e * e * e - 1);
            },
            easeInOutQuart: function (e) {
              return (e /= 0.5) < 1 ? 0.5 * e * e * e * e : -0.5 * ((e -= 2) * e * e * e - 2);
            },
            easeInQuint: function (e) {
              return e * e * e * e * e;
            },
            easeOutQuint: function (e) {
              return (e -= 1) * e * e * e * e + 1;
            },
            easeInOutQuint: function (e) {
              return (e /= 0.5) < 1 ? 0.5 * e * e * e * e * e : 0.5 * ((e -= 2) * e * e * e * e + 2);
            },
            easeInSine: function (e) {
              return 1 - Math.cos(e * (Math.PI / 2));
            },
            easeOutSine: function (e) {
              return Math.sin(e * (Math.PI / 2));
            },
            easeInOutSine: function (e) {
              return -0.5 * (Math.cos(Math.PI * e) - 1);
            },
            easeInExpo: function (e) {
              return 0 === e ? 0 : Math.pow(2, 10 * (e - 1));
            },
            easeOutExpo: function (e) {
              return 1 === e ? 1 : 1 - Math.pow(2, -10 * e);
            },
            easeInOutExpo: function (e) {
              return 0 === e
                ? 0
                : 1 === e
                ? 1
                : (e /= 0.5) < 1
                ? 0.5 * Math.pow(2, 10 * (e - 1))
                : 0.5 * (2 - Math.pow(2, -10 * --e));
            },
            easeInCirc: function (e) {
              return e >= 1 ? e : -(Math.sqrt(1 - e * e) - 1);
            },
            easeOutCirc: function (e) {
              return Math.sqrt(1 - (e -= 1) * e);
            },
            easeInOutCirc: function (e) {
              return (e /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - e * e) - 1) : 0.5 * (Math.sqrt(1 - (e -= 2) * e) + 1);
            },
            easeInElastic: function (e) {
              var t = 1.70158,
                n = 0,
                a = 1;
              return 0 === e
                ? 0
                : 1 === e
                ? 1
                : (n || (n = 0.3),
                  a < 1 ? ((a = 1), (t = n / 4)) : (t = (n / (2 * Math.PI)) * Math.asin(1 / a)),
                  -a * Math.pow(2, 10 * (e -= 1)) * Math.sin(((e - t) * (2 * Math.PI)) / n));
            },
            easeOutElastic: function (e) {
              var t = 1.70158,
                n = 0,
                a = 1;
              return 0 === e
                ? 0
                : 1 === e
                ? 1
                : (n || (n = 0.3),
                  a < 1 ? ((a = 1), (t = n / 4)) : (t = (n / (2 * Math.PI)) * Math.asin(1 / a)),
                  a * Math.pow(2, -10 * e) * Math.sin(((e - t) * (2 * Math.PI)) / n) + 1);
            },
            easeInOutElastic: function (e) {
              var t = 1.70158,
                n = 0,
                a = 1;
              return 0 === e
                ? 0
                : 2 == (e /= 0.5)
                ? 1
                : (n || (n = 0.45),
                  a < 1 ? ((a = 1), (t = n / 4)) : (t = (n / (2 * Math.PI)) * Math.asin(1 / a)),
                  e < 1
                    ? a * Math.pow(2, 10 * (e -= 1)) * Math.sin(((e - t) * (2 * Math.PI)) / n) * -0.5
                    : a * Math.pow(2, -10 * (e -= 1)) * Math.sin(((e - t) * (2 * Math.PI)) / n) * 0.5 + 1);
            },
            easeInBack: function (e) {
              var t = 1.70158;
              return e * e * ((t + 1) * e - t);
            },
            easeOutBack: function (e) {
              var t = 1.70158;
              return (e -= 1) * e * ((t + 1) * e + t) + 1;
            },
            easeInOutBack: function (e) {
              var t = 1.70158;
              return (e /= 0.5) < 1
                ? e * e * ((1 + (t *= 1.525)) * e - t) * 0.5
                : 0.5 * ((e -= 2) * e * ((1 + (t *= 1.525)) * e + t) + 2);
            },
            easeInBounce: function (e) {
              return 1 - w.easeOutBounce(1 - e);
            },
            easeOutBounce: function (e) {
              return e < 1 / 2.75
                ? 7.5625 * e * e
                : e < 2 / 2.75
                ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75
                : e < 2.5 / 2.75
                ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375
                : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375;
            },
            easeInOutBounce: function (e) {
              return e < 0.5 ? 0.5 * w.easeInBounce(2 * e) : 0.5 * w.easeOutBounce(2 * e - 1) + 0.5;
            },
          },
          x = { effects: w };
        D.easingEffects = w;
        var T = Math.PI,
          S = T / 180,
          H = 2 * T,
          j = T / 2,
          P = T / 4,
          O = (2 * T) / 3,
          A = {
            clear: function (e) {
              e.ctx.clearRect(0, 0, e.width, e.height);
            },
            roundedRect: function (e, t, n, a, r, i) {
              if (i) {
                var s = Math.min(i, r / 2, a / 2),
                  o = t + s,
                  d = n + s,
                  l = t + a - s,
                  u = n + r - s;
                e.moveTo(t, d),
                  o < l && d < u
                    ? (e.arc(o, d, s, -T, -j), e.arc(l, d, s, -j, 0), e.arc(l, u, s, 0, j), e.arc(o, u, s, j, T))
                    : o < l
                    ? (e.moveTo(o, n), e.arc(l, d, s, -j, j), e.arc(o, d, s, j, T + j))
                    : d < u
                    ? (e.arc(o, d, s, -T, 0), e.arc(o, u, s, 0, T))
                    : e.arc(o, d, s, -T, T),
                  e.closePath(),
                  e.moveTo(t, n);
              } else e.rect(t, n, a, r);
            },
            drawPoint: function (e, t, n, a, r, i) {
              var s,
                o,
                d,
                l,
                u,
                _ = (i || 0) * S;
              if (
                t &&
                'object' == typeof t &&
                ('[object HTMLImageElement]' === (s = t.toString()) || '[object HTMLCanvasElement]' === s)
              )
                return (
                  e.save(),
                  e.translate(a, r),
                  e.rotate(_),
                  e.drawImage(t, -t.width / 2, -t.height / 2, t.width, t.height),
                  void e.restore()
                );
              if (!(isNaN(n) || n <= 0)) {
                switch ((e.beginPath(), t)) {
                  default:
                    e.arc(a, r, n, 0, H), e.closePath();
                    break;
                  case 'triangle':
                    e.moveTo(a + Math.sin(_) * n, r - Math.cos(_) * n),
                      (_ += O),
                      e.lineTo(a + Math.sin(_) * n, r - Math.cos(_) * n),
                      (_ += O),
                      e.lineTo(a + Math.sin(_) * n, r - Math.cos(_) * n),
                      e.closePath();
                    break;
                  case 'rectRounded':
                    (l = n - (u = 0.516 * n)),
                      (o = Math.cos(_ + P) * l),
                      (d = Math.sin(_ + P) * l),
                      e.arc(a - o, r - d, u, _ - T, _ - j),
                      e.arc(a + d, r - o, u, _ - j, _),
                      e.arc(a + o, r + d, u, _, _ + j),
                      e.arc(a - d, r + o, u, _ + j, _ + T),
                      e.closePath();
                    break;
                  case 'rect':
                    if (!i) {
                      (l = Math.SQRT1_2 * n), e.rect(a - l, r - l, 2 * l, 2 * l);
                      break;
                    }
                    _ += P;
                  case 'rectRot':
                    (o = Math.cos(_) * n),
                      (d = Math.sin(_) * n),
                      e.moveTo(a - o, r - d),
                      e.lineTo(a + d, r - o),
                      e.lineTo(a + o, r + d),
                      e.lineTo(a - d, r + o),
                      e.closePath();
                    break;
                  case 'crossRot':
                    _ += P;
                  case 'cross':
                    (o = Math.cos(_) * n),
                      (d = Math.sin(_) * n),
                      e.moveTo(a - o, r - d),
                      e.lineTo(a + o, r + d),
                      e.moveTo(a + d, r - o),
                      e.lineTo(a - d, r + o);
                    break;
                  case 'star':
                    (o = Math.cos(_) * n),
                      (d = Math.sin(_) * n),
                      e.moveTo(a - o, r - d),
                      e.lineTo(a + o, r + d),
                      e.moveTo(a + d, r - o),
                      e.lineTo(a - d, r + o),
                      (_ += P),
                      (o = Math.cos(_) * n),
                      (d = Math.sin(_) * n),
                      e.moveTo(a - o, r - d),
                      e.lineTo(a + o, r + d),
                      e.moveTo(a + d, r - o),
                      e.lineTo(a - d, r + o);
                    break;
                  case 'line':
                    (o = Math.cos(_) * n), (d = Math.sin(_) * n), e.moveTo(a - o, r - d), e.lineTo(a + o, r + d);
                    break;
                  case 'dash':
                    e.moveTo(a, r), e.lineTo(a + Math.cos(_) * n, r + Math.sin(_) * n);
                }
                e.fill(), e.stroke();
              }
            },
            _isPointInArea: function (e, t) {
              return e.x > t.left - 1e-6 && e.x < t.right + 1e-6 && e.y > t.top - 1e-6 && e.y < t.bottom + 1e-6;
            },
            clipArea: function (e, t) {
              e.save(), e.beginPath(), e.rect(t.left, t.top, t.right - t.left, t.bottom - t.top), e.clip();
            },
            unclipArea: function (e) {
              e.restore();
            },
            lineTo: function (e, t, n, a) {
              var r = n.steppedLine;
              if (r) {
                if ('middle' === r) {
                  var i = (t.x + n.x) / 2;
                  e.lineTo(i, a ? n.y : t.y), e.lineTo(i, a ? t.y : n.y);
                } else ('after' === r && !a) || ('after' !== r && a) ? e.lineTo(t.x, n.y) : e.lineTo(n.x, t.y);
                e.lineTo(n.x, n.y);
              } else
                n.tension
                  ? e.bezierCurveTo(
                      a ? t.controlPointPreviousX : t.controlPointNextX,
                      a ? t.controlPointPreviousY : t.controlPointNextY,
                      a ? n.controlPointNextX : n.controlPointPreviousX,
                      a ? n.controlPointNextY : n.controlPointPreviousY,
                      n.x,
                      n.y,
                    )
                  : e.lineTo(n.x, n.y);
            },
          },
          F = A;
        (D.clear = A.clear),
          (D.drawRoundedRectangle = function (e) {
            e.beginPath(), A.roundedRect.apply(A, arguments);
          });
        var W = {
          _set: function (e, t) {
            return D.merge(this[e] || (this[e] = {}), t);
          },
        };
        W._set('global', {
          defaultColor: 'rgba(0,0,0,0.1)',
          defaultFontColor: '#666',
          defaultFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          defaultFontSize: 12,
          defaultFontStyle: 'normal',
          defaultLineHeight: 1.2,
          showLines: !0,
        });
        var C = W,
          E = D.valueOrDefault,
          z = {
            toLineHeight: function (e, t) {
              var n = ('' + e).match(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);
              if (!n || 'normal' === n[1]) return 1.2 * t;
              switch (((e = +n[2]), n[3])) {
                case 'px':
                  return e;
                case '%':
                  e /= 100;
              }
              return t * e;
            },
            toPadding: function (e) {
              var t, n, a, r;
              return (
                D.isObject(e)
                  ? ((t = +e.top || 0), (n = +e.right || 0), (a = +e.bottom || 0), (r = +e.left || 0))
                  : (t = n = a = r = +e || 0),
                { top: t, right: n, bottom: a, left: r, height: t + a, width: r + n }
              );
            },
            _parseFont: function (e) {
              var t = C.global,
                n = E(e.fontSize, t.defaultFontSize),
                a = {
                  family: E(e.fontFamily, t.defaultFontFamily),
                  lineHeight: D.options.toLineHeight(E(e.lineHeight, t.defaultLineHeight), n),
                  size: n,
                  style: E(e.fontStyle, t.defaultFontStyle),
                  weight: null,
                  string: '',
                };
              return (
                (a.string = (function (e) {
                  return !e || D.isNullOrUndef(e.size) || D.isNullOrUndef(e.family)
                    ? null
                    : (e.style ? e.style + ' ' : '') + (e.weight ? e.weight + ' ' : '') + e.size + 'px ' + e.family;
                })(a)),
                a
              );
            },
            resolve: function (e, t, n, a) {
              var r,
                i,
                s,
                o = !0;
              for (r = 0, i = e.length; r < i; ++r)
                if (
                  void 0 !== (s = e[r]) &&
                  (void 0 !== t && 'function' == typeof s && ((s = s(t)), (o = !1)),
                  void 0 !== n && D.isArray(s) && ((s = s[n]), (o = !1)),
                  void 0 !== s)
                )
                  return a && !o && (a.cacheable = !1), s;
            },
          },
          I = {
            _factorize: function (e) {
              var t,
                n = [],
                a = Math.sqrt(e);
              for (t = 1; t < a; t++) e % t == 0 && (n.push(t), n.push(e / t));
              return (
                a === (0 | a) && n.push(a),
                n
                  .sort(function (e, t) {
                    return e - t;
                  })
                  .pop(),
                n
              );
            },
            log10:
              Math.log10 ||
              function (e) {
                var t = Math.log(e) * Math.LOG10E,
                  n = Math.round(t);
                return e === Math.pow(10, n) ? n : t;
              },
          },
          N = I;
        D.log10 = I.log10;
        var R = D,
          V = x,
          B = F,
          J = z,
          U = N,
          G = {
            getRtlAdapter: function (e, t, n) {
              return e
                ? (function (e, t) {
                    return {
                      x: function (n) {
                        return e + e + t - n;
                      },
                      setWidth: function (e) {
                        t = e;
                      },
                      textAlign: function (e) {
                        return 'center' === e ? e : 'right' === e ? 'left' : 'right';
                      },
                      xPlus: function (e, t) {
                        return e - t;
                      },
                      leftForLtr: function (e, t) {
                        return e - t;
                      },
                    };
                  })(t, n)
                : {
                    x: function (e) {
                      return e;
                    },
                    setWidth: function (e) {},
                    textAlign: function (e) {
                      return e;
                    },
                    xPlus: function (e, t) {
                      return e + t;
                    },
                    leftForLtr: function (e, t) {
                      return e;
                    },
                  };
            },
            overrideTextDirection: function (e, t) {
              var n, a;
              ('ltr' !== t && 'rtl' !== t) ||
                ((a = [(n = e.canvas.style).getPropertyValue('direction'), n.getPropertyPriority('direction')]),
                n.setProperty('direction', t, 'important'),
                (e.prevTextDirection = a));
            },
            restoreTextDirection: function (e) {
              var t = e.prevTextDirection;
              void 0 !== t && (delete e.prevTextDirection, e.canvas.style.setProperty('direction', t[0], t[1]));
            },
          };
        (R.easing = V), (R.canvas = B), (R.options = J), (R.math = U), (R.rtl = G);
        var q = function (e) {
          R.extend(this, e), this.initialize.apply(this, arguments);
        };
        R.extend(q.prototype, {
          _type: void 0,
          initialize: function () {
            this.hidden = !1;
          },
          pivot: function () {
            var e = this;
            return e._view || (e._view = R.extend({}, e._model)), (e._start = {}), e;
          },
          transition: function (e) {
            var t = this,
              n = t._model,
              a = t._start,
              r = t._view;
            return n && 1 !== e
              ? (r || (r = t._view = {}),
                a || (a = t._start = {}),
                (function (e, t, n, a) {
                  var r,
                    i,
                    s,
                    o,
                    d,
                    l,
                    u,
                    _,
                    c,
                    h = Object.keys(n);
                  for (r = 0, i = h.length; r < i; ++r)
                    if (((l = n[(s = h[r])]), t.hasOwnProperty(s) || (t[s] = l), (o = t[s]) !== l && '_' !== s[0])) {
                      if ((e.hasOwnProperty(s) || (e[s] = o), (u = typeof l) == typeof (d = e[s])))
                        if ('string' === u) {
                          if ((_ = v(d)).valid && (c = v(l)).valid) {
                            t[s] = c.mix(_, a).rgbString();
                            continue;
                          }
                        } else if (R.isFinite(d) && R.isFinite(l)) {
                          t[s] = d + (l - d) * a;
                          continue;
                        }
                      t[s] = l;
                    }
                })(a, r, n, e),
                t)
              : ((t._view = R.extend({}, n)), (t._start = null), t);
          },
          tooltipPosition: function () {
            return { x: this._model.x, y: this._model.y };
          },
          hasValue: function () {
            return R.isNumber(this._model.x) && R.isNumber(this._model.y);
          },
        }),
          (q.extend = R.inherits);
        var $ = q,
          K = $.extend({
            chart: null,
            currentStep: 0,
            numSteps: 60,
            easing: '',
            render: null,
            onAnimationProgress: null,
            onAnimationComplete: null,
          }),
          Z = K;
        Object.defineProperty(K.prototype, 'animationObject', {
          get: function () {
            return this;
          },
        }),
          Object.defineProperty(K.prototype, 'chartInstance', {
            get: function () {
              return this.chart;
            },
            set: function (e) {
              this.chart = e;
            },
          }),
          C._set('global', {
            animation: { duration: 1e3, easing: 'easeOutQuart', onProgress: R.noop, onComplete: R.noop },
          });
        var X = {
            animations: [],
            request: null,
            addAnimation: function (e, t, n, a) {
              var r,
                i,
                s = this.animations;
              for (
                t.chart = e, t.startTime = Date.now(), t.duration = n, a || (e.animating = !0), r = 0, i = s.length;
                r < i;
                ++r
              )
                if (s[r].chart === e) return void (s[r] = t);
              s.push(t), 1 === s.length && this.requestAnimationFrame();
            },
            cancelAnimation: function (e) {
              var t = R.findIndex(this.animations, function (t) {
                return t.chart === e;
              });
              -1 !== t && (this.animations.splice(t, 1), (e.animating = !1));
            },
            requestAnimationFrame: function () {
              var e = this;
              null === e.request &&
                (e.request = R.requestAnimFrame.call(window, function () {
                  (e.request = null), e.startDigest();
                }));
            },
            startDigest: function () {
              this.advance(), this.animations.length > 0 && this.requestAnimationFrame();
            },
            advance: function () {
              for (var e, t, n, a, r = this.animations, i = 0; i < r.length; )
                (t = (e = r[i]).chart),
                  (n = e.numSteps),
                  (a = Math.floor(((Date.now() - e.startTime) / e.duration) * n) + 1),
                  (e.currentStep = Math.min(a, n)),
                  R.callback(e.render, [t, e], t),
                  R.callback(e.onAnimationProgress, [e], t),
                  e.currentStep >= n
                    ? (R.callback(e.onAnimationComplete, [e], t), (t.animating = !1), r.splice(i, 1))
                    : ++i;
            },
          },
          Q = R.options.resolve,
          ee = ['push', 'pop', 'shift', 'splice', 'unshift'];
        function te(e, t) {
          var n = e._chartjs;
          if (n) {
            var a = n.listeners,
              r = a.indexOf(t);
            -1 !== r && a.splice(r, 1),
              a.length > 0 ||
                (ee.forEach(function (t) {
                  delete e[t];
                }),
                delete e._chartjs);
          }
        }
        var ne = function (e, t) {
          this.initialize(e, t);
        };
        R.extend(ne.prototype, {
          datasetElementType: null,
          dataElementType: null,
          _datasetElementOptions: [
            'backgroundColor',
            'borderCapStyle',
            'borderColor',
            'borderDash',
            'borderDashOffset',
            'borderJoinStyle',
            'borderWidth',
          ],
          _dataElementOptions: ['backgroundColor', 'borderColor', 'borderWidth', 'pointStyle'],
          initialize: function (e, t) {
            var n = this;
            (n.chart = e), (n.index = t), n.linkScales(), n.addElements(), (n._type = n.getMeta().type);
          },
          updateIndex: function (e) {
            this.index = e;
          },
          linkScales: function () {
            var e = this.getMeta(),
              t = this.chart,
              n = t.scales,
              a = this.getDataset(),
              r = t.options.scales;
            (null !== e.xAxisID && e.xAxisID in n && !a.xAxisID) || (e.xAxisID = a.xAxisID || r.xAxes[0].id),
              (null !== e.yAxisID && e.yAxisID in n && !a.yAxisID) || (e.yAxisID = a.yAxisID || r.yAxes[0].id);
          },
          getDataset: function () {
            return this.chart.data.datasets[this.index];
          },
          getMeta: function () {
            return this.chart.getDatasetMeta(this.index);
          },
          getScaleForId: function (e) {
            return this.chart.scales[e];
          },
          _getValueScaleId: function () {
            return this.getMeta().yAxisID;
          },
          _getIndexScaleId: function () {
            return this.getMeta().xAxisID;
          },
          _getValueScale: function () {
            return this.getScaleForId(this._getValueScaleId());
          },
          _getIndexScale: function () {
            return this.getScaleForId(this._getIndexScaleId());
          },
          reset: function () {
            this._update(!0);
          },
          destroy: function () {
            this._data && te(this._data, this);
          },
          createMetaDataset: function () {
            var e = this.datasetElementType;
            return e && new e({ _chart: this.chart, _datasetIndex: this.index });
          },
          createMetaData: function (e) {
            var t = this.dataElementType;
            return t && new t({ _chart: this.chart, _datasetIndex: this.index, _index: e });
          },
          addElements: function () {
            var e,
              t,
              n = this.getMeta(),
              a = this.getDataset().data || [],
              r = n.data;
            for (e = 0, t = a.length; e < t; ++e) r[e] = r[e] || this.createMetaData(e);
            n.dataset = n.dataset || this.createMetaDataset();
          },
          addElementAndReset: function (e) {
            var t = this.createMetaData(e);
            this.getMeta().data.splice(e, 0, t), this.updateElement(t, e, !0);
          },
          buildOrUpdateElements: function () {
            var e,
              t,
              n = this,
              a = n.getDataset(),
              r = a.data || (a.data = []);
            n._data !== r &&
              (n._data && te(n._data, n),
              r &&
                Object.isExtensible(r) &&
                ((t = n),
                (e = r)._chartjs
                  ? e._chartjs.listeners.push(t)
                  : (Object.defineProperty(e, '_chartjs', {
                      configurable: !0,
                      enumerable: !1,
                      value: { listeners: [t] },
                    }),
                    ee.forEach(function (t) {
                      var n = 'onData' + t.charAt(0).toUpperCase() + t.slice(1),
                        a = e[t];
                      Object.defineProperty(e, t, {
                        configurable: !0,
                        enumerable: !1,
                        value: function () {
                          var t = Array.prototype.slice.call(arguments),
                            r = a.apply(this, t);
                          return (
                            R.each(e._chartjs.listeners, function (e) {
                              'function' == typeof e[n] && e[n].apply(e, t);
                            }),
                            r
                          );
                        },
                      });
                    }))),
              (n._data = r)),
              n.resyncElements();
          },
          _configure: function () {
            this._config = R.merge(Object.create(null), [this.chart.options.datasets[this._type], this.getDataset()], {
              merger: function (e, t, n) {
                '_meta' !== e && 'data' !== e && R._merger(e, t, n);
              },
            });
          },
          _update: function (e) {
            this._configure(), (this._cachedDataOpts = null), this.update(e);
          },
          update: R.noop,
          transition: function (e) {
            for (var t = this.getMeta(), n = t.data || [], a = n.length, r = 0; r < a; ++r) n[r].transition(e);
            t.dataset && t.dataset.transition(e);
          },
          draw: function () {
            var e = this.getMeta(),
              t = e.data || [],
              n = t.length,
              a = 0;
            for (e.dataset && e.dataset.draw(); a < n; ++a) t[a].draw();
          },
          getStyle: function (e) {
            var t,
              n = this.getMeta(),
              a = n.dataset;
            return (
              this._configure(),
              a && void 0 === e
                ? (t = this._resolveDatasetElementOptions(a || {}))
                : ((e = e || 0), (t = this._resolveDataElementOptions(n.data[e] || {}, e))),
              (!1 !== t.fill && null !== t.fill) || (t.backgroundColor = t.borderColor),
              t
            );
          },
          _resolveDatasetElementOptions: function (e, t) {
            var n,
              a,
              r,
              i,
              s = this,
              o = s.chart,
              d = s._config,
              l = e.custom || {},
              u = o.options.elements[s.datasetElementType.prototype._type] || {},
              _ = s._datasetElementOptions,
              c = {},
              h = { chart: o, dataset: s.getDataset(), datasetIndex: s.index, hover: t };
            for (n = 0, a = _.length; n < a; ++n)
              (r = _[n]),
                (i = t ? 'hover' + r.charAt(0).toUpperCase() + r.slice(1) : r),
                (c[r] = Q([l[i], d[i], u[i]], h));
            return c;
          },
          _resolveDataElementOptions: function (e, t) {
            var n = this,
              a = e && e.custom,
              r = n._cachedDataOpts;
            if (r && !a) return r;
            var i,
              s,
              o,
              d,
              l = n.chart,
              u = n._config,
              _ = l.options.elements[n.dataElementType.prototype._type] || {},
              c = n._dataElementOptions,
              h = {},
              m = { chart: l, dataIndex: t, dataset: n.getDataset(), datasetIndex: n.index },
              f = { cacheable: !a };
            if (((a = a || {}), R.isArray(c)))
              for (s = 0, o = c.length; s < o; ++s) h[(d = c[s])] = Q([a[d], u[d], _[d]], m, t, f);
            else
              for (s = 0, o = (i = Object.keys(c)).length; s < o; ++s)
                h[(d = i[s])] = Q([a[d], u[c[d]], u[d], _[d]], m, t, f);
            return f.cacheable && (n._cachedDataOpts = Object.freeze(h)), h;
          },
          removeHoverStyle: function (e) {
            R.merge(e._model, e.$previousStyle || {}), delete e.$previousStyle;
          },
          setHoverStyle: function (e) {
            var t = this.chart.data.datasets[e._datasetIndex],
              n = e._index,
              a = e.custom || {},
              r = e._model,
              i = R.getHoverColor;
            (e.$previousStyle = {
              backgroundColor: r.backgroundColor,
              borderColor: r.borderColor,
              borderWidth: r.borderWidth,
            }),
              (r.backgroundColor = Q(
                [a.hoverBackgroundColor, t.hoverBackgroundColor, i(r.backgroundColor)],
                void 0,
                n,
              )),
              (r.borderColor = Q([a.hoverBorderColor, t.hoverBorderColor, i(r.borderColor)], void 0, n)),
              (r.borderWidth = Q([a.hoverBorderWidth, t.hoverBorderWidth, r.borderWidth], void 0, n));
          },
          _removeDatasetHoverStyle: function () {
            var e = this.getMeta().dataset;
            e && this.removeHoverStyle(e);
          },
          _setDatasetHoverStyle: function () {
            var e,
              t,
              n,
              a,
              r,
              i,
              s = this.getMeta().dataset,
              o = {};
            if (s) {
              for (
                i = s._model, r = this._resolveDatasetElementOptions(s, !0), e = 0, t = (a = Object.keys(r)).length;
                e < t;
                ++e
              )
                (o[(n = a[e])] = i[n]), (i[n] = r[n]);
              s.$previousStyle = o;
            }
          },
          resyncElements: function () {
            var e = this.getMeta(),
              t = this.getDataset().data,
              n = e.data.length,
              a = t.length;
            a < n ? e.data.splice(a, n - a) : a > n && this.insertElements(n, a - n);
          },
          insertElements: function (e, t) {
            for (var n = 0; n < t; ++n) this.addElementAndReset(e + n);
          },
          onDataPush: function () {
            var e = arguments.length;
            this.insertElements(this.getDataset().data.length - e, e);
          },
          onDataPop: function () {
            this.getMeta().data.pop();
          },
          onDataShift: function () {
            this.getMeta().data.shift();
          },
          onDataSplice: function (e, t) {
            this.getMeta().data.splice(e, t), this.insertElements(e, arguments.length - 2);
          },
          onDataUnshift: function () {
            this.insertElements(0, arguments.length);
          },
        }),
          (ne.extend = R.inherits);
        var ae = ne,
          re = 2 * Math.PI;
        function ie(e, t) {
          var n = t.startAngle,
            a = t.endAngle,
            r = t.pixelMargin,
            i = r / t.outerRadius,
            s = t.x,
            o = t.y;
          e.beginPath(),
            e.arc(s, o, t.outerRadius, n - i, a + i),
            t.innerRadius > r
              ? ((i = r / t.innerRadius), e.arc(s, o, t.innerRadius - r, a + i, n - i, !0))
              : e.arc(s, o, r, a + Math.PI / 2, n - Math.PI / 2),
            e.closePath(),
            e.clip();
        }
        function se(e, t, n) {
          var a = 'inner' === t.borderAlign;
          a
            ? ((e.lineWidth = 2 * t.borderWidth), (e.lineJoin = 'round'))
            : ((e.lineWidth = t.borderWidth), (e.lineJoin = 'bevel')),
            n.fullCircles &&
              (function (e, t, n, a) {
                var r,
                  i = n.endAngle;
                for (
                  a &&
                    ((n.endAngle = n.startAngle + re),
                    ie(e, n),
                    (n.endAngle = i),
                    n.endAngle === n.startAngle && n.fullCircles && ((n.endAngle += re), n.fullCircles--)),
                    e.beginPath(),
                    e.arc(n.x, n.y, n.innerRadius, n.startAngle + re, n.startAngle, !0),
                    r = 0;
                  r < n.fullCircles;
                  ++r
                )
                  e.stroke();
                for (
                  e.beginPath(), e.arc(n.x, n.y, t.outerRadius, n.startAngle, n.startAngle + re), r = 0;
                  r < n.fullCircles;
                  ++r
                )
                  e.stroke();
              })(e, t, n, a),
            a && ie(e, n),
            e.beginPath(),
            e.arc(n.x, n.y, t.outerRadius, n.startAngle, n.endAngle),
            e.arc(n.x, n.y, n.innerRadius, n.endAngle, n.startAngle, !0),
            e.closePath(),
            e.stroke();
        }
        C._set('global', {
          elements: {
            arc: { backgroundColor: C.global.defaultColor, borderColor: '#fff', borderWidth: 2, borderAlign: 'center' },
          },
        });
        var oe = $.extend({
            _type: 'arc',
            inLabelRange: function (e) {
              var t = this._view;
              return !!t && Math.pow(e - t.x, 2) < Math.pow(t.radius + t.hoverRadius, 2);
            },
            inRange: function (e, t) {
              var n = this._view;
              if (n) {
                for (
                  var a = R.getAngleFromPoint(n, { x: e, y: t }),
                    r = a.angle,
                    i = a.distance,
                    s = n.startAngle,
                    o = n.endAngle;
                  o < s;

                )
                  o += re;
                for (; r > o; ) r -= re;
                for (; r < s; ) r += re;
                var d = r >= s && r <= o,
                  l = i >= n.innerRadius && i <= n.outerRadius;
                return d && l;
              }
              return !1;
            },
            getCenterPoint: function () {
              var e = this._view,
                t = (e.startAngle + e.endAngle) / 2,
                n = (e.innerRadius + e.outerRadius) / 2;
              return { x: e.x + Math.cos(t) * n, y: e.y + Math.sin(t) * n };
            },
            getArea: function () {
              var e = this._view;
              return (
                Math.PI *
                ((e.endAngle - e.startAngle) / (2 * Math.PI)) *
                (Math.pow(e.outerRadius, 2) - Math.pow(e.innerRadius, 2))
              );
            },
            tooltipPosition: function () {
              var e = this._view,
                t = e.startAngle + (e.endAngle - e.startAngle) / 2,
                n = (e.outerRadius - e.innerRadius) / 2 + e.innerRadius;
              return { x: e.x + Math.cos(t) * n, y: e.y + Math.sin(t) * n };
            },
            draw: function () {
              var e,
                t = this._chart.ctx,
                n = this._view,
                a = 'inner' === n.borderAlign ? 0.33 : 0,
                r = {
                  x: n.x,
                  y: n.y,
                  innerRadius: n.innerRadius,
                  outerRadius: Math.max(n.outerRadius - a, 0),
                  pixelMargin: a,
                  startAngle: n.startAngle,
                  endAngle: n.endAngle,
                  fullCircles: Math.floor(n.circumference / re),
                };
              if ((t.save(), (t.fillStyle = n.backgroundColor), (t.strokeStyle = n.borderColor), r.fullCircles)) {
                for (
                  r.endAngle = r.startAngle + re,
                    t.beginPath(),
                    t.arc(r.x, r.y, r.outerRadius, r.startAngle, r.endAngle),
                    t.arc(r.x, r.y, r.innerRadius, r.endAngle, r.startAngle, !0),
                    t.closePath(),
                    e = 0;
                  e < r.fullCircles;
                  ++e
                )
                  t.fill();
                r.endAngle = r.startAngle + (n.circumference % re);
              }
              t.beginPath(),
                t.arc(r.x, r.y, r.outerRadius, r.startAngle, r.endAngle),
                t.arc(r.x, r.y, r.innerRadius, r.endAngle, r.startAngle, !0),
                t.closePath(),
                t.fill(),
                n.borderWidth && se(t, n, r),
                t.restore();
            },
          }),
          de = R.valueOrDefault,
          le = C.global.defaultColor;
        C._set('global', {
          elements: {
            line: {
              tension: 0.4,
              backgroundColor: le,
              borderWidth: 3,
              borderColor: le,
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0,
              borderJoinStyle: 'miter',
              capBezierPoints: !0,
              fill: !0,
            },
          },
        });
        var ue = $.extend({
            _type: 'line',
            draw: function () {
              var e,
                t,
                n,
                a = this,
                r = a._view,
                i = a._chart.ctx,
                s = r.spanGaps,
                o = a._children.slice(),
                d = C.global,
                l = d.elements.line,
                u = -1,
                _ = a._loop;
              if (o.length) {
                if (a._loop) {
                  for (e = 0; e < o.length; ++e)
                    if (((t = R.previousItem(o, e)), !o[e]._view.skip && t._view.skip)) {
                      (o = o.slice(e).concat(o.slice(0, e))), (_ = s);
                      break;
                    }
                  _ && o.push(o[0]);
                }
                for (
                  i.save(),
                    i.lineCap = r.borderCapStyle || l.borderCapStyle,
                    i.setLineDash && i.setLineDash(r.borderDash || l.borderDash),
                    i.lineDashOffset = de(r.borderDashOffset, l.borderDashOffset),
                    i.lineJoin = r.borderJoinStyle || l.borderJoinStyle,
                    i.lineWidth = de(r.borderWidth, l.borderWidth),
                    i.strokeStyle = r.borderColor || d.defaultColor,
                    i.beginPath(),
                    (n = o[0]._view).skip || (i.moveTo(n.x, n.y), (u = 0)),
                    e = 1;
                  e < o.length;
                  ++e
                )
                  (n = o[e]._view),
                    (t = -1 === u ? R.previousItem(o, e) : o[u]),
                    n.skip ||
                      ((u !== e - 1 && !s) || -1 === u ? i.moveTo(n.x, n.y) : R.canvas.lineTo(i, t._view, n), (u = e));
                _ && i.closePath(), i.stroke(), i.restore();
              }
            },
          }),
          _e = R.valueOrDefault,
          ce = C.global.defaultColor;
        function he(e) {
          var t = this._view;
          return !!t && Math.abs(e - t.x) < t.radius + t.hitRadius;
        }
        C._set('global', {
          elements: {
            point: {
              radius: 3,
              pointStyle: 'circle',
              backgroundColor: ce,
              borderColor: ce,
              borderWidth: 1,
              hitRadius: 1,
              hoverRadius: 4,
              hoverBorderWidth: 1,
            },
          },
        });
        var me = $.extend({
            _type: 'point',
            inRange: function (e, t) {
              var n = this._view;
              return !!n && Math.pow(e - n.x, 2) + Math.pow(t - n.y, 2) < Math.pow(n.hitRadius + n.radius, 2);
            },
            inLabelRange: he,
            inXRange: he,
            inYRange: function (e) {
              var t = this._view;
              return !!t && Math.abs(e - t.y) < t.radius + t.hitRadius;
            },
            getCenterPoint: function () {
              var e = this._view;
              return { x: e.x, y: e.y };
            },
            getArea: function () {
              return Math.PI * Math.pow(this._view.radius, 2);
            },
            tooltipPosition: function () {
              var e = this._view;
              return { x: e.x, y: e.y, padding: e.radius + e.borderWidth };
            },
            draw: function (e) {
              var t = this._view,
                n = this._chart.ctx,
                a = t.pointStyle,
                r = t.rotation,
                i = t.radius,
                s = t.x,
                o = t.y,
                d = C.global,
                l = d.defaultColor;
              t.skip ||
                ((void 0 === e || R.canvas._isPointInArea(t, e)) &&
                  ((n.strokeStyle = t.borderColor || l),
                  (n.lineWidth = _e(t.borderWidth, d.elements.point.borderWidth)),
                  (n.fillStyle = t.backgroundColor || l),
                  R.canvas.drawPoint(n, a, i, s, o, r)));
            },
          }),
          fe = C.global.defaultColor;
        function pe(e) {
          return e && void 0 !== e.width;
        }
        function Me(e) {
          var t, n, a, r, i;
          return (
            pe(e)
              ? ((i = e.width / 2),
                (t = e.x - i),
                (n = e.x + i),
                (a = Math.min(e.y, e.base)),
                (r = Math.max(e.y, e.base)))
              : ((i = e.height / 2),
                (t = Math.min(e.x, e.base)),
                (n = Math.max(e.x, e.base)),
                (a = e.y - i),
                (r = e.y + i)),
            { left: t, top: a, right: n, bottom: r }
          );
        }
        function ye(e, t, n) {
          return e === t ? n : e === n ? t : e;
        }
        function ge(e, t, n) {
          var a,
            r,
            i,
            s,
            o = e.borderWidth,
            d = (function (e) {
              var t = e.borderSkipped,
                n = {};
              return t
                ? (e.horizontal
                    ? e.base > e.x && (t = ye(t, 'left', 'right'))
                    : e.base < e.y && (t = ye(t, 'bottom', 'top')),
                  (n[t] = !0),
                  n)
                : n;
            })(e);
          return (
            R.isObject(o)
              ? ((a = +o.top || 0), (r = +o.right || 0), (i = +o.bottom || 0), (s = +o.left || 0))
              : (a = r = i = s = +o || 0),
            {
              t: d.top || a < 0 ? 0 : a > n ? n : a,
              r: d.right || r < 0 ? 0 : r > t ? t : r,
              b: d.bottom || i < 0 ? 0 : i > n ? n : i,
              l: d.left || s < 0 ? 0 : s > t ? t : s,
            }
          );
        }
        function Le(e, t, n) {
          var a = null === t,
            r = null === n,
            i = !(!e || (a && r)) && Me(e);
          return i && (a || (t >= i.left && t <= i.right)) && (r || (n >= i.top && n <= i.bottom));
        }
        C._set('global', {
          elements: { rectangle: { backgroundColor: fe, borderColor: fe, borderSkipped: 'bottom', borderWidth: 0 } },
        });
        var ve = $.extend({
            _type: 'rectangle',
            draw: function () {
              var e = this._chart.ctx,
                t = this._view,
                n = (function (e) {
                  var t = Me(e),
                    n = t.right - t.left,
                    a = t.bottom - t.top,
                    r = ge(e, n / 2, a / 2);
                  return {
                    outer: { x: t.left, y: t.top, w: n, h: a },
                    inner: { x: t.left + r.l, y: t.top + r.t, w: n - r.l - r.r, h: a - r.t - r.b },
                  };
                })(t),
                a = n.outer,
                r = n.inner;
              (e.fillStyle = t.backgroundColor),
                e.fillRect(a.x, a.y, a.w, a.h),
                (a.w === r.w && a.h === r.h) ||
                  (e.save(),
                  e.beginPath(),
                  e.rect(a.x, a.y, a.w, a.h),
                  e.clip(),
                  (e.fillStyle = t.borderColor),
                  e.rect(r.x, r.y, r.w, r.h),
                  e.fill('evenodd'),
                  e.restore());
            },
            height: function () {
              var e = this._view;
              return e.base - e.y;
            },
            inRange: function (e, t) {
              return Le(this._view, e, t);
            },
            inLabelRange: function (e, t) {
              var n = this._view;
              return pe(n) ? Le(n, e, null) : Le(n, null, t);
            },
            inXRange: function (e) {
              return Le(this._view, e, null);
            },
            inYRange: function (e) {
              return Le(this._view, null, e);
            },
            getCenterPoint: function () {
              var e,
                t,
                n = this._view;
              return (
                pe(n) ? ((e = n.x), (t = (n.y + n.base) / 2)) : ((e = (n.x + n.base) / 2), (t = n.y)), { x: e, y: t }
              );
            },
            getArea: function () {
              var e = this._view;
              return pe(e) ? e.width * Math.abs(e.y - e.base) : e.height * Math.abs(e.x - e.base);
            },
            tooltipPosition: function () {
              var e = this._view;
              return { x: e.x, y: e.y };
            },
          }),
          Ye = {},
          be = oe,
          ke = ue,
          De = me,
          we = ve;
        (Ye.Arc = be), (Ye.Line = ke), (Ye.Point = De), (Ye.Rectangle = we);
        var xe = R._deprecated,
          Te = R.valueOrDefault;
        function Se(e, t, n) {
          var a,
            r,
            i = n.barThickness,
            s = t.stackCount,
            o = t.pixels[e],
            d = R.isNullOrUndef(i)
              ? (function (e, t) {
                  var n,
                    a,
                    r,
                    i,
                    s = e._length;
                  for (r = 1, i = t.length; r < i; ++r) s = Math.min(s, Math.abs(t[r] - t[r - 1]));
                  for (r = 0, i = e.getTicks().length; r < i; ++r)
                    (a = e.getPixelForTick(r)), (s = r > 0 ? Math.min(s, Math.abs(a - n)) : s), (n = a);
                  return s;
                })(t.scale, t.pixels)
              : -1;
          return (
            R.isNullOrUndef(i) ? ((a = d * n.categoryPercentage), (r = n.barPercentage)) : ((a = i * s), (r = 1)),
            { chunk: a / s, ratio: r, start: o - a / 2 }
          );
        }
        C._set('bar', {
          hover: { mode: 'label' },
          scales: {
            xAxes: [{ type: 'category', offset: !0, gridLines: { offsetGridLines: !0 } }],
            yAxes: [{ type: 'linear' }],
          },
        }),
          C._set('global', { datasets: { bar: { categoryPercentage: 0.8, barPercentage: 0.9 } } });
        var He = ae.extend({
            dataElementType: Ye.Rectangle,
            _dataElementOptions: [
              'backgroundColor',
              'borderColor',
              'borderSkipped',
              'borderWidth',
              'barPercentage',
              'barThickness',
              'categoryPercentage',
              'maxBarThickness',
              'minBarLength',
            ],
            initialize: function () {
              var e,
                t,
                n = this;
              ae.prototype.initialize.apply(n, arguments),
                ((e = n.getMeta()).stack = n.getDataset().stack),
                (e.bar = !0),
                (t = n._getIndexScale().options),
                xe('bar chart', t.barPercentage, 'scales.[x/y]Axes.barPercentage', 'dataset.barPercentage'),
                xe('bar chart', t.barThickness, 'scales.[x/y]Axes.barThickness', 'dataset.barThickness'),
                xe(
                  'bar chart',
                  t.categoryPercentage,
                  'scales.[x/y]Axes.categoryPercentage',
                  'dataset.categoryPercentage',
                ),
                xe(
                  'bar chart',
                  n._getValueScale().options.minBarLength,
                  'scales.[x/y]Axes.minBarLength',
                  'dataset.minBarLength',
                ),
                xe('bar chart', t.maxBarThickness, 'scales.[x/y]Axes.maxBarThickness', 'dataset.maxBarThickness');
            },
            update: function (e) {
              var t,
                n,
                a = this.getMeta().data;
              for (this._ruler = this.getRuler(), t = 0, n = a.length; t < n; ++t) this.updateElement(a[t], t, e);
            },
            updateElement: function (e, t, n) {
              var a = this,
                r = a.getMeta(),
                i = a.getDataset(),
                s = a._resolveDataElementOptions(e, t);
              (e._xScale = a.getScaleForId(r.xAxisID)),
                (e._yScale = a.getScaleForId(r.yAxisID)),
                (e._datasetIndex = a.index),
                (e._index = t),
                (e._model = {
                  backgroundColor: s.backgroundColor,
                  borderColor: s.borderColor,
                  borderSkipped: s.borderSkipped,
                  borderWidth: s.borderWidth,
                  datasetLabel: i.label,
                  label: a.chart.data.labels[t],
                }),
                R.isArray(i.data[t]) && (e._model.borderSkipped = null),
                a._updateElementGeometry(e, t, n, s),
                e.pivot();
            },
            _updateElementGeometry: function (e, t, n, a) {
              var r = this,
                i = e._model,
                s = r._getValueScale(),
                o = s.getBasePixel(),
                d = s.isHorizontal(),
                l = r._ruler || r.getRuler(),
                u = r.calculateBarValuePixels(r.index, t, a),
                _ = r.calculateBarIndexPixels(r.index, t, l, a);
              (i.horizontal = d),
                (i.base = n ? o : u.base),
                (i.x = d ? (n ? o : u.head) : _.center),
                (i.y = d ? _.center : n ? o : u.head),
                (i.height = d ? _.size : void 0),
                (i.width = d ? void 0 : _.size);
            },
            _getStacks: function (e) {
              var t,
                n,
                a = this._getIndexScale(),
                r = a._getMatchingVisibleMetas(this._type),
                i = a.options.stacked,
                s = r.length,
                o = [];
              for (
                t = 0;
                t < s &&
                ((n = r[t]),
                (!1 === i || -1 === o.indexOf(n.stack) || (void 0 === i && void 0 === n.stack)) && o.push(n.stack),
                n.index !== e);
                ++t
              );
              return o;
            },
            getStackCount: function () {
              return this._getStacks().length;
            },
            getStackIndex: function (e, t) {
              var n = this._getStacks(e),
                a = void 0 !== t ? n.indexOf(t) : -1;
              return -1 === a ? n.length - 1 : a;
            },
            getRuler: function () {
              var e,
                t,
                n = this._getIndexScale(),
                a = [];
              for (e = 0, t = this.getMeta().data.length; e < t; ++e) a.push(n.getPixelForValue(null, e, this.index));
              return { pixels: a, start: n._startPixel, end: n._endPixel, stackCount: this.getStackCount(), scale: n };
            },
            calculateBarValuePixels: function (e, t, n) {
              var a,
                r,
                i,
                s,
                o,
                d,
                l,
                u = this.chart,
                _ = this._getValueScale(),
                c = _.isHorizontal(),
                h = u.data.datasets,
                m = _._getMatchingVisibleMetas(this._type),
                f = _._parseValue(h[e].data[t]),
                p = n.minBarLength,
                M = _.options.stacked,
                y = this.getMeta().stack,
                g = void 0 === f.start ? 0 : f.max >= 0 && f.min >= 0 ? f.min : f.max,
                L = void 0 === f.start ? f.end : f.max >= 0 && f.min >= 0 ? f.max - f.min : f.min - f.max,
                v = m.length;
              if (M || (void 0 === M && void 0 !== y))
                for (a = 0; a < v && (r = m[a]).index !== e; ++a)
                  r.stack === y &&
                    ((i =
                      void 0 === (l = _._parseValue(h[r.index].data[t])).start
                        ? l.end
                        : l.min >= 0 && l.max >= 0
                        ? l.max
                        : l.min),
                    ((f.min < 0 && i < 0) || (f.max >= 0 && i > 0)) && (g += i));
              return (
                (s = _.getPixelForValue(g)),
                (d = (o = _.getPixelForValue(g + L)) - s),
                void 0 !== p && Math.abs(d) < p && ((d = p), (o = (L >= 0 && !c) || (L < 0 && c) ? s - p : s + p)),
                { size: d, base: s, head: o, center: o + d / 2 }
              );
            },
            calculateBarIndexPixels: function (e, t, n, a) {
              var r =
                  'flex' === a.barThickness
                    ? (function (e, t, n) {
                        var a,
                          r = t.pixels,
                          i = r[e],
                          s = e > 0 ? r[e - 1] : null,
                          o = e < r.length - 1 ? r[e + 1] : null,
                          d = n.categoryPercentage;
                        return (
                          null === s && (s = i - (null === o ? t.end - t.start : o - i)),
                          null === o && (o = i + i - s),
                          (a = i - ((i - Math.min(s, o)) / 2) * d),
                          { chunk: ((Math.abs(o - s) / 2) * d) / t.stackCount, ratio: n.barPercentage, start: a }
                        );
                      })(t, n, a)
                    : Se(t, n, a),
                i = this.getStackIndex(e, this.getMeta().stack),
                s = r.start + r.chunk * i + r.chunk / 2,
                o = Math.min(Te(a.maxBarThickness, 1 / 0), r.chunk * r.ratio);
              return { base: s - o / 2, head: s + o / 2, center: s, size: o };
            },
            draw: function () {
              var e = this.chart,
                t = this._getValueScale(),
                n = this.getMeta().data,
                a = this.getDataset(),
                r = n.length,
                i = 0;
              for (R.canvas.clipArea(e.ctx, e.chartArea); i < r; ++i) {
                var s = t._parseValue(a.data[i]);
                isNaN(s.min) || isNaN(s.max) || n[i].draw();
              }
              R.canvas.unclipArea(e.ctx);
            },
            _resolveDataElementOptions: function () {
              var e = this,
                t = R.extend({}, ae.prototype._resolveDataElementOptions.apply(e, arguments)),
                n = e._getIndexScale().options,
                a = e._getValueScale().options;
              return (
                (t.barPercentage = Te(n.barPercentage, t.barPercentage)),
                (t.barThickness = Te(n.barThickness, t.barThickness)),
                (t.categoryPercentage = Te(n.categoryPercentage, t.categoryPercentage)),
                (t.maxBarThickness = Te(n.maxBarThickness, t.maxBarThickness)),
                (t.minBarLength = Te(a.minBarLength, t.minBarLength)),
                t
              );
            },
          }),
          je = R.valueOrDefault,
          Pe = R.options.resolve;
        C._set('bubble', {
          hover: { mode: 'single' },
          scales: {
            xAxes: [{ type: 'linear', position: 'bottom', id: 'x-axis-0' }],
            yAxes: [{ type: 'linear', position: 'left', id: 'y-axis-0' }],
          },
          tooltips: {
            callbacks: {
              title: function () {
                return '';
              },
              label: function (e, t) {
                var n = t.datasets[e.datasetIndex].label || '',
                  a = t.datasets[e.datasetIndex].data[e.index];
                return n + ': (' + e.xLabel + ', ' + e.yLabel + ', ' + a.r + ')';
              },
            },
          },
        });
        var Oe = ae.extend({
            dataElementType: Ye.Point,
            _dataElementOptions: [
              'backgroundColor',
              'borderColor',
              'borderWidth',
              'hoverBackgroundColor',
              'hoverBorderColor',
              'hoverBorderWidth',
              'hoverRadius',
              'hitRadius',
              'pointStyle',
              'rotation',
            ],
            update: function (e) {
              var t = this,
                n = t.getMeta().data;
              R.each(n, function (n, a) {
                t.updateElement(n, a, e);
              });
            },
            updateElement: function (e, t, n) {
              var a = this,
                r = a.getMeta(),
                i = e.custom || {},
                s = a.getScaleForId(r.xAxisID),
                o = a.getScaleForId(r.yAxisID),
                d = a._resolveDataElementOptions(e, t),
                l = a.getDataset().data[t],
                u = a.index,
                _ = n ? s.getPixelForDecimal(0.5) : s.getPixelForValue('object' == typeof l ? l : NaN, t, u),
                c = n ? o.getBasePixel() : o.getPixelForValue(l, t, u);
              (e._xScale = s),
                (e._yScale = o),
                (e._options = d),
                (e._datasetIndex = u),
                (e._index = t),
                (e._model = {
                  backgroundColor: d.backgroundColor,
                  borderColor: d.borderColor,
                  borderWidth: d.borderWidth,
                  hitRadius: d.hitRadius,
                  pointStyle: d.pointStyle,
                  rotation: d.rotation,
                  radius: n ? 0 : d.radius,
                  skip: i.skip || isNaN(_) || isNaN(c),
                  x: _,
                  y: c,
                }),
                e.pivot();
            },
            setHoverStyle: function (e) {
              var t = e._model,
                n = e._options,
                a = R.getHoverColor;
              (e.$previousStyle = {
                backgroundColor: t.backgroundColor,
                borderColor: t.borderColor,
                borderWidth: t.borderWidth,
                radius: t.radius,
              }),
                (t.backgroundColor = je(n.hoverBackgroundColor, a(n.backgroundColor))),
                (t.borderColor = je(n.hoverBorderColor, a(n.borderColor))),
                (t.borderWidth = je(n.hoverBorderWidth, n.borderWidth)),
                (t.radius = n.radius + n.hoverRadius);
            },
            _resolveDataElementOptions: function (e, t) {
              var n = this,
                a = n.chart,
                r = n.getDataset(),
                i = e.custom || {},
                s = r.data[t] || {},
                o = ae.prototype._resolveDataElementOptions.apply(n, arguments),
                d = { chart: a, dataIndex: t, dataset: r, datasetIndex: n.index };
              return (
                n._cachedDataOpts === o && (o = R.extend({}, o)),
                (o.radius = Pe([i.radius, s.r, n._config.radius, a.options.elements.point.radius], d, t)),
                o
              );
            },
          }),
          Ae = R.valueOrDefault,
          Fe = Math.PI,
          We = 2 * Fe,
          Ce = Fe / 2;
        C._set('doughnut', {
          animation: { animateRotate: !0, animateScale: !1 },
          hover: { mode: 'single' },
          legendCallback: function (e) {
            var t,
              n,
              a,
              r = document.createElement('ul'),
              i = e.data,
              s = i.datasets,
              o = i.labels;
            if ((r.setAttribute('class', e.id + '-legend'), s.length))
              for (t = 0, n = s[0].data.length; t < n; ++t)
                ((a = r.appendChild(document.createElement('li'))).appendChild(
                  document.createElement('span'),
                ).style.backgroundColor = s[0].backgroundColor[t]),
                  o[t] && a.appendChild(document.createTextNode(o[t]));
            return r.outerHTML;
          },
          legend: {
            labels: {
              generateLabels: function (e) {
                var t = e.data;
                return t.labels.length && t.datasets.length
                  ? t.labels.map(function (n, a) {
                      var r = e.getDatasetMeta(0),
                        i = r.controller.getStyle(a);
                      return {
                        text: n,
                        fillStyle: i.backgroundColor,
                        strokeStyle: i.borderColor,
                        lineWidth: i.borderWidth,
                        hidden: isNaN(t.datasets[0].data[a]) || r.data[a].hidden,
                        index: a,
                      };
                    })
                  : [];
              },
            },
            onClick: function (e, t) {
              var n,
                a,
                r,
                i = t.index,
                s = this.chart;
              for (n = 0, a = (s.data.datasets || []).length; n < a; ++n)
                (r = s.getDatasetMeta(n)).data[i] && (r.data[i].hidden = !r.data[i].hidden);
              s.update();
            },
          },
          cutoutPercentage: 50,
          rotation: -Ce,
          circumference: We,
          tooltips: {
            callbacks: {
              title: function () {
                return '';
              },
              label: function (e, t) {
                var n = t.labels[e.index],
                  a = ': ' + t.datasets[e.datasetIndex].data[e.index];
                return R.isArray(n) ? ((n = n.slice())[0] += a) : (n += a), n;
              },
            },
          },
        });
        var Ee = ae.extend({
          dataElementType: Ye.Arc,
          linkScales: R.noop,
          _dataElementOptions: [
            'backgroundColor',
            'borderColor',
            'borderWidth',
            'borderAlign',
            'hoverBackgroundColor',
            'hoverBorderColor',
            'hoverBorderWidth',
          ],
          getRingIndex: function (e) {
            for (var t = 0, n = 0; n < e; ++n) this.chart.isDatasetVisible(n) && ++t;
            return t;
          },
          update: function (e) {
            var t,
              n,
              a,
              r,
              i = this,
              s = i.chart,
              o = s.chartArea,
              d = s.options,
              l = 1,
              u = 1,
              _ = 0,
              c = 0,
              h = i.getMeta(),
              m = h.data,
              f = d.cutoutPercentage / 100 || 0,
              p = d.circumference,
              M = i._getRingWeight(i.index);
            if (p < We) {
              var y = d.rotation % We,
                g = (y += y >= Fe ? -We : y < -Fe ? We : 0) + p,
                L = Math.cos(y),
                v = Math.sin(y),
                Y = Math.cos(g),
                b = Math.sin(g),
                k = (y <= 0 && g >= 0) || g >= We,
                D = (y <= Ce && g >= Ce) || g >= We + Ce,
                w = (y <= -Ce && g >= -Ce) || g >= Fe + Ce,
                x = y === -Fe || g >= Fe ? -1 : Math.min(L, L * f, Y, Y * f),
                T = w ? -1 : Math.min(v, v * f, b, b * f),
                S = k ? 1 : Math.max(L, L * f, Y, Y * f),
                H = D ? 1 : Math.max(v, v * f, b, b * f);
              (l = (S - x) / 2), (u = (H - T) / 2), (_ = -(S + x) / 2), (c = -(H + T) / 2);
            }
            for (a = 0, r = m.length; a < r; ++a) m[a]._options = i._resolveDataElementOptions(m[a], a);
            for (
              s.borderWidth = i.getMaxBorderWidth(),
                t = (o.right - o.left - s.borderWidth) / l,
                n = (o.bottom - o.top - s.borderWidth) / u,
                s.outerRadius = Math.max(Math.min(t, n) / 2, 0),
                s.innerRadius = Math.max(s.outerRadius * f, 0),
                s.radiusLength = (s.outerRadius - s.innerRadius) / (i._getVisibleDatasetWeightTotal() || 1),
                s.offsetX = _ * s.outerRadius,
                s.offsetY = c * s.outerRadius,
                h.total = i.calculateTotal(),
                i.outerRadius = s.outerRadius - s.radiusLength * i._getRingWeightOffset(i.index),
                i.innerRadius = Math.max(i.outerRadius - s.radiusLength * M, 0),
                a = 0,
                r = m.length;
              a < r;
              ++a
            )
              i.updateElement(m[a], a, e);
          },
          updateElement: function (e, t, n) {
            var a = this,
              r = a.chart,
              i = r.chartArea,
              s = r.options,
              o = s.animation,
              d = (i.left + i.right) / 2,
              l = (i.top + i.bottom) / 2,
              u = s.rotation,
              _ = s.rotation,
              c = a.getDataset(),
              h = (n && o.animateRotate) || e.hidden ? 0 : a.calculateCircumference(c.data[t]) * (s.circumference / We),
              m = n && o.animateScale ? 0 : a.innerRadius,
              f = n && o.animateScale ? 0 : a.outerRadius,
              p = e._options || {};
            R.extend(e, {
              _datasetIndex: a.index,
              _index: t,
              _model: {
                backgroundColor: p.backgroundColor,
                borderColor: p.borderColor,
                borderWidth: p.borderWidth,
                borderAlign: p.borderAlign,
                x: d + r.offsetX,
                y: l + r.offsetY,
                startAngle: u,
                endAngle: _,
                circumference: h,
                outerRadius: f,
                innerRadius: m,
                label: R.valueAtIndexOrDefault(c.label, t, r.data.labels[t]),
              },
            });
            var M = e._model;
            (n && o.animateRotate) ||
              ((M.startAngle = 0 === t ? s.rotation : a.getMeta().data[t - 1]._model.endAngle),
              (M.endAngle = M.startAngle + M.circumference)),
              e.pivot();
          },
          calculateTotal: function () {
            var e,
              t = this.getDataset(),
              n = this.getMeta(),
              a = 0;
            return (
              R.each(n.data, function (n, r) {
                (e = t.data[r]), isNaN(e) || n.hidden || (a += Math.abs(e));
              }),
              a
            );
          },
          calculateCircumference: function (e) {
            var t = this.getMeta().total;
            return t > 0 && !isNaN(e) ? We * (Math.abs(e) / t) : 0;
          },
          getMaxBorderWidth: function (e) {
            var t,
              n,
              a,
              r,
              i,
              s,
              o,
              d,
              l = 0,
              u = this.chart;
            if (!e)
              for (t = 0, n = u.data.datasets.length; t < n; ++t)
                if (u.isDatasetVisible(t)) {
                  (e = (a = u.getDatasetMeta(t)).data), t !== this.index && (i = a.controller);
                  break;
                }
            if (!e) return 0;
            for (t = 0, n = e.length; t < n; ++t)
              (r = e[t]),
                i ? (i._configure(), (s = i._resolveDataElementOptions(r, t))) : (s = r._options),
                'inner' !== s.borderAlign &&
                  ((o = s.borderWidth), (l = (d = s.hoverBorderWidth) > (l = o > l ? o : l) ? d : l));
            return l;
          },
          setHoverStyle: function (e) {
            var t = e._model,
              n = e._options,
              a = R.getHoverColor;
            (e.$previousStyle = {
              backgroundColor: t.backgroundColor,
              borderColor: t.borderColor,
              borderWidth: t.borderWidth,
            }),
              (t.backgroundColor = Ae(n.hoverBackgroundColor, a(n.backgroundColor))),
              (t.borderColor = Ae(n.hoverBorderColor, a(n.borderColor))),
              (t.borderWidth = Ae(n.hoverBorderWidth, n.borderWidth));
          },
          _getRingWeightOffset: function (e) {
            for (var t = 0, n = 0; n < e; ++n) this.chart.isDatasetVisible(n) && (t += this._getRingWeight(n));
            return t;
          },
          _getRingWeight: function (e) {
            return Math.max(Ae(this.chart.data.datasets[e].weight, 1), 0);
          },
          _getVisibleDatasetWeightTotal: function () {
            return this._getRingWeightOffset(this.chart.data.datasets.length);
          },
        });
        C._set('horizontalBar', {
          hover: { mode: 'index', axis: 'y' },
          scales: {
            xAxes: [{ type: 'linear', position: 'bottom' }],
            yAxes: [{ type: 'category', position: 'left', offset: !0, gridLines: { offsetGridLines: !0 } }],
          },
          elements: { rectangle: { borderSkipped: 'left' } },
          tooltips: { mode: 'index', axis: 'y' },
        }),
          C._set('global', { datasets: { horizontalBar: { categoryPercentage: 0.8, barPercentage: 0.9 } } });
        var ze = He.extend({
            _getValueScaleId: function () {
              return this.getMeta().xAxisID;
            },
            _getIndexScaleId: function () {
              return this.getMeta().yAxisID;
            },
          }),
          Ie = R.valueOrDefault,
          Ne = R.options.resolve,
          Re = R.canvas._isPointInArea;
        function Ve(e, t) {
          var n = (e && e.options.ticks) || {},
            a = n.reverse,
            r = void 0 === n.min ? t : 0,
            i = void 0 === n.max ? t : 0;
          return { start: a ? i : r, end: a ? r : i };
        }
        function Be(e, t, n) {
          var a = n / 2,
            r = Ve(e, a),
            i = Ve(t, a);
          return { top: i.end, right: r.end, bottom: i.start, left: r.start };
        }
        function Je(e) {
          var t, n, a, r;
          return (
            R.isObject(e) ? ((t = e.top), (n = e.right), (a = e.bottom), (r = e.left)) : (t = n = a = r = e),
            { top: t, right: n, bottom: a, left: r }
          );
        }
        C._set('line', {
          showLines: !0,
          spanGaps: !1,
          hover: { mode: 'label' },
          scales: { xAxes: [{ type: 'category', id: 'x-axis-0' }], yAxes: [{ type: 'linear', id: 'y-axis-0' }] },
        });
        var Ue = ae.extend({
            datasetElementType: Ye.Line,
            dataElementType: Ye.Point,
            _datasetElementOptions: [
              'backgroundColor',
              'borderCapStyle',
              'borderColor',
              'borderDash',
              'borderDashOffset',
              'borderJoinStyle',
              'borderWidth',
              'cubicInterpolationMode',
              'fill',
            ],
            _dataElementOptions: {
              backgroundColor: 'pointBackgroundColor',
              borderColor: 'pointBorderColor',
              borderWidth: 'pointBorderWidth',
              hitRadius: 'pointHitRadius',
              hoverBackgroundColor: 'pointHoverBackgroundColor',
              hoverBorderColor: 'pointHoverBorderColor',
              hoverBorderWidth: 'pointHoverBorderWidth',
              hoverRadius: 'pointHoverRadius',
              pointStyle: 'pointStyle',
              radius: 'pointRadius',
              rotation: 'pointRotation',
            },
            update: function (e) {
              var t,
                n,
                a = this,
                r = a.getMeta(),
                i = r.dataset,
                s = r.data || [],
                o = a.chart.options,
                d = a._config,
                l = (a._showLine = Ie(d.showLine, o.showLines));
              for (
                a._xScale = a.getScaleForId(r.xAxisID),
                  a._yScale = a.getScaleForId(r.yAxisID),
                  l &&
                    (void 0 !== d.tension && void 0 === d.lineTension && (d.lineTension = d.tension),
                    (i._scale = a._yScale),
                    (i._datasetIndex = a.index),
                    (i._children = s),
                    (i._model = a._resolveDatasetElementOptions(i)),
                    i.pivot()),
                  t = 0,
                  n = s.length;
                t < n;
                ++t
              )
                a.updateElement(s[t], t, e);
              for (l && 0 !== i._model.tension && a.updateBezierControlPoints(), t = 0, n = s.length; t < n; ++t)
                s[t].pivot();
            },
            updateElement: function (e, t, n) {
              var a,
                r,
                i = this,
                s = i.getMeta(),
                o = e.custom || {},
                d = i.getDataset(),
                l = i.index,
                u = d.data[t],
                _ = i._xScale,
                c = i._yScale,
                h = s.dataset._model,
                m = i._resolveDataElementOptions(e, t);
              (a = _.getPixelForValue('object' == typeof u ? u : NaN, t, l)),
                (r = n ? c.getBasePixel() : i.calculatePointY(u, t, l)),
                (e._xScale = _),
                (e._yScale = c),
                (e._options = m),
                (e._datasetIndex = l),
                (e._index = t),
                (e._model = {
                  x: a,
                  y: r,
                  skip: o.skip || isNaN(a) || isNaN(r),
                  radius: m.radius,
                  pointStyle: m.pointStyle,
                  rotation: m.rotation,
                  backgroundColor: m.backgroundColor,
                  borderColor: m.borderColor,
                  borderWidth: m.borderWidth,
                  tension: Ie(o.tension, h ? h.tension : 0),
                  steppedLine: !!h && h.steppedLine,
                  hitRadius: m.hitRadius,
                });
            },
            _resolveDatasetElementOptions: function (e) {
              var t = this,
                n = t._config,
                a = e.custom || {},
                r = t.chart.options,
                i = r.elements.line,
                s = ae.prototype._resolveDatasetElementOptions.apply(t, arguments);
              return (
                (s.spanGaps = Ie(n.spanGaps, r.spanGaps)),
                (s.tension = Ie(n.lineTension, i.tension)),
                (s.steppedLine = Ne([a.steppedLine, n.steppedLine, i.stepped])),
                (s.clip = Je(Ie(n.clip, Be(t._xScale, t._yScale, s.borderWidth)))),
                s
              );
            },
            calculatePointY: function (e, t, n) {
              var a,
                r,
                i,
                s,
                o,
                d,
                l,
                u = this.chart,
                _ = this._yScale,
                c = 0,
                h = 0;
              if (_.options.stacked) {
                for (
                  o = +_.getRightValue(e), l = (d = u._getSortedVisibleDatasetMetas()).length, a = 0;
                  a < l && (i = d[a]).index !== n;
                  ++a
                )
                  (r = u.data.datasets[i.index]),
                    'line' === i.type &&
                      i.yAxisID === _.id &&
                      ((s = +_.getRightValue(r.data[t])) < 0 ? (h += s || 0) : (c += s || 0));
                return o < 0 ? _.getPixelForValue(h + o) : _.getPixelForValue(c + o);
              }
              return _.getPixelForValue(e);
            },
            updateBezierControlPoints: function () {
              var e,
                t,
                n,
                a,
                r = this.chart,
                i = this.getMeta(),
                s = i.dataset._model,
                o = r.chartArea,
                d = i.data || [];
              function l(e, t, n) {
                return Math.max(Math.min(e, n), t);
              }
              if (
                (s.spanGaps &&
                  (d = d.filter(function (e) {
                    return !e._model.skip;
                  })),
                'monotone' === s.cubicInterpolationMode)
              )
                R.splineCurveMonotone(d);
              else
                for (e = 0, t = d.length; e < t; ++e)
                  (n = d[e]._model),
                    (a = R.splineCurve(R.previousItem(d, e)._model, n, R.nextItem(d, e)._model, s.tension)),
                    (n.controlPointPreviousX = a.previous.x),
                    (n.controlPointPreviousY = a.previous.y),
                    (n.controlPointNextX = a.next.x),
                    (n.controlPointNextY = a.next.y);
              if (r.options.elements.line.capBezierPoints)
                for (e = 0, t = d.length; e < t; ++e)
                  (n = d[e]._model),
                    Re(n, o) &&
                      (e > 0 &&
                        Re(d[e - 1]._model, o) &&
                        ((n.controlPointPreviousX = l(n.controlPointPreviousX, o.left, o.right)),
                        (n.controlPointPreviousY = l(n.controlPointPreviousY, o.top, o.bottom))),
                      e < d.length - 1 &&
                        Re(d[e + 1]._model, o) &&
                        ((n.controlPointNextX = l(n.controlPointNextX, o.left, o.right)),
                        (n.controlPointNextY = l(n.controlPointNextY, o.top, o.bottom))));
            },
            draw: function () {
              var e,
                t = this.chart,
                n = this.getMeta(),
                a = n.data || [],
                r = t.chartArea,
                i = t.canvas,
                s = 0,
                o = a.length;
              for (
                this._showLine &&
                ((e = n.dataset._model.clip),
                R.canvas.clipArea(t.ctx, {
                  left: !1 === e.left ? 0 : r.left - e.left,
                  right: !1 === e.right ? i.width : r.right + e.right,
                  top: !1 === e.top ? 0 : r.top - e.top,
                  bottom: !1 === e.bottom ? i.height : r.bottom + e.bottom,
                }),
                n.dataset.draw(),
                R.canvas.unclipArea(t.ctx));
                s < o;
                ++s
              )
                a[s].draw(r);
            },
            setHoverStyle: function (e) {
              var t = e._model,
                n = e._options,
                a = R.getHoverColor;
              (e.$previousStyle = {
                backgroundColor: t.backgroundColor,
                borderColor: t.borderColor,
                borderWidth: t.borderWidth,
                radius: t.radius,
              }),
                (t.backgroundColor = Ie(n.hoverBackgroundColor, a(n.backgroundColor))),
                (t.borderColor = Ie(n.hoverBorderColor, a(n.borderColor))),
                (t.borderWidth = Ie(n.hoverBorderWidth, n.borderWidth)),
                (t.radius = Ie(n.hoverRadius, n.radius));
            },
          }),
          Ge = R.options.resolve;
        C._set('polarArea', {
          scale: {
            type: 'radialLinear',
            angleLines: { display: !1 },
            gridLines: { circular: !0 },
            pointLabels: { display: !1 },
            ticks: { beginAtZero: !0 },
          },
          animation: { animateRotate: !0, animateScale: !0 },
          startAngle: -0.5 * Math.PI,
          legendCallback: function (e) {
            var t,
              n,
              a,
              r = document.createElement('ul'),
              i = e.data,
              s = i.datasets,
              o = i.labels;
            if ((r.setAttribute('class', e.id + '-legend'), s.length))
              for (t = 0, n = s[0].data.length; t < n; ++t)
                ((a = r.appendChild(document.createElement('li'))).appendChild(
                  document.createElement('span'),
                ).style.backgroundColor = s[0].backgroundColor[t]),
                  o[t] && a.appendChild(document.createTextNode(o[t]));
            return r.outerHTML;
          },
          legend: {
            labels: {
              generateLabels: function (e) {
                var t = e.data;
                return t.labels.length && t.datasets.length
                  ? t.labels.map(function (n, a) {
                      var r = e.getDatasetMeta(0),
                        i = r.controller.getStyle(a);
                      return {
                        text: n,
                        fillStyle: i.backgroundColor,
                        strokeStyle: i.borderColor,
                        lineWidth: i.borderWidth,
                        hidden: isNaN(t.datasets[0].data[a]) || r.data[a].hidden,
                        index: a,
                      };
                    })
                  : [];
              },
            },
            onClick: function (e, t) {
              var n,
                a,
                r,
                i = t.index,
                s = this.chart;
              for (n = 0, a = (s.data.datasets || []).length; n < a; ++n)
                (r = s.getDatasetMeta(n)).data[i].hidden = !r.data[i].hidden;
              s.update();
            },
          },
          tooltips: {
            callbacks: {
              title: function () {
                return '';
              },
              label: function (e, t) {
                return t.labels[e.index] + ': ' + e.yLabel;
              },
            },
          },
        });
        var qe = ae.extend({
          dataElementType: Ye.Arc,
          linkScales: R.noop,
          _dataElementOptions: [
            'backgroundColor',
            'borderColor',
            'borderWidth',
            'borderAlign',
            'hoverBackgroundColor',
            'hoverBorderColor',
            'hoverBorderWidth',
          ],
          _getIndexScaleId: function () {
            return this.chart.scale.id;
          },
          _getValueScaleId: function () {
            return this.chart.scale.id;
          },
          update: function (e) {
            var t,
              n,
              a,
              r = this,
              i = r.getDataset(),
              s = r.getMeta(),
              o = r.chart.options.startAngle || 0,
              d = (r._starts = []),
              l = (r._angles = []),
              u = s.data;
            for (r._updateRadius(), s.count = r.countVisibleElements(), t = 0, n = i.data.length; t < n; t++)
              (d[t] = o), (a = r._computeAngle(t)), (l[t] = a), (o += a);
            for (t = 0, n = u.length; t < n; ++t)
              (u[t]._options = r._resolveDataElementOptions(u[t], t)), r.updateElement(u[t], t, e);
          },
          _updateRadius: function () {
            var e = this,
              t = e.chart,
              n = t.chartArea,
              a = t.options,
              r = Math.min(n.right - n.left, n.bottom - n.top);
            (t.outerRadius = Math.max(r / 2, 0)),
              (t.innerRadius = Math.max(a.cutoutPercentage ? (t.outerRadius / 100) * a.cutoutPercentage : 1, 0)),
              (t.radiusLength = (t.outerRadius - t.innerRadius) / t.getVisibleDatasetCount()),
              (e.outerRadius = t.outerRadius - t.radiusLength * e.index),
              (e.innerRadius = e.outerRadius - t.radiusLength);
          },
          updateElement: function (e, t, n) {
            var a = this,
              r = a.chart,
              i = a.getDataset(),
              s = r.options,
              o = s.animation,
              d = r.scale,
              l = r.data.labels,
              u = d.xCenter,
              _ = d.yCenter,
              c = s.startAngle,
              h = e.hidden ? 0 : d.getDistanceFromCenterForValue(i.data[t]),
              m = a._starts[t],
              f = m + (e.hidden ? 0 : a._angles[t]),
              p = o.animateScale ? 0 : d.getDistanceFromCenterForValue(i.data[t]),
              M = e._options || {};
            R.extend(e, {
              _datasetIndex: a.index,
              _index: t,
              _scale: d,
              _model: {
                backgroundColor: M.backgroundColor,
                borderColor: M.borderColor,
                borderWidth: M.borderWidth,
                borderAlign: M.borderAlign,
                x: u,
                y: _,
                innerRadius: 0,
                outerRadius: n ? p : h,
                startAngle: n && o.animateRotate ? c : m,
                endAngle: n && o.animateRotate ? c : f,
                label: R.valueAtIndexOrDefault(l, t, l[t]),
              },
            }),
              e.pivot();
          },
          countVisibleElements: function () {
            var e = this.getDataset(),
              t = this.getMeta(),
              n = 0;
            return (
              R.each(t.data, function (t, a) {
                isNaN(e.data[a]) || t.hidden || n++;
              }),
              n
            );
          },
          setHoverStyle: function (e) {
            var t = e._model,
              n = e._options,
              a = R.getHoverColor,
              r = R.valueOrDefault;
            (e.$previousStyle = {
              backgroundColor: t.backgroundColor,
              borderColor: t.borderColor,
              borderWidth: t.borderWidth,
            }),
              (t.backgroundColor = r(n.hoverBackgroundColor, a(n.backgroundColor))),
              (t.borderColor = r(n.hoverBorderColor, a(n.borderColor))),
              (t.borderWidth = r(n.hoverBorderWidth, n.borderWidth));
          },
          _computeAngle: function (e) {
            var t = this,
              n = this.getMeta().count,
              a = t.getDataset(),
              r = t.getMeta();
            if (isNaN(a.data[e]) || r.data[e].hidden) return 0;
            var i = { chart: t.chart, dataIndex: e, dataset: a, datasetIndex: t.index };
            return Ge([t.chart.options.elements.arc.angle, (2 * Math.PI) / n], i, e);
          },
        });
        C._set('pie', R.clone(C.doughnut)), C._set('pie', { cutoutPercentage: 0 });
        var $e = Ee,
          Ke = R.valueOrDefault;
        C._set('radar', {
          spanGaps: !1,
          scale: { type: 'radialLinear' },
          elements: { line: { fill: 'start', tension: 0 } },
        });
        var Ze = ae.extend({
          datasetElementType: Ye.Line,
          dataElementType: Ye.Point,
          linkScales: R.noop,
          _datasetElementOptions: [
            'backgroundColor',
            'borderWidth',
            'borderColor',
            'borderCapStyle',
            'borderDash',
            'borderDashOffset',
            'borderJoinStyle',
            'fill',
          ],
          _dataElementOptions: {
            backgroundColor: 'pointBackgroundColor',
            borderColor: 'pointBorderColor',
            borderWidth: 'pointBorderWidth',
            hitRadius: 'pointHitRadius',
            hoverBackgroundColor: 'pointHoverBackgroundColor',
            hoverBorderColor: 'pointHoverBorderColor',
            hoverBorderWidth: 'pointHoverBorderWidth',
            hoverRadius: 'pointHoverRadius',
            pointStyle: 'pointStyle',
            radius: 'pointRadius',
            rotation: 'pointRotation',
          },
          _getIndexScaleId: function () {
            return this.chart.scale.id;
          },
          _getValueScaleId: function () {
            return this.chart.scale.id;
          },
          update: function (e) {
            var t,
              n,
              a = this,
              r = a.getMeta(),
              i = r.dataset,
              s = r.data || [],
              o = a.chart.scale,
              d = a._config;
            for (
              void 0 !== d.tension && void 0 === d.lineTension && (d.lineTension = d.tension),
                i._scale = o,
                i._datasetIndex = a.index,
                i._children = s,
                i._loop = !0,
                i._model = a._resolveDatasetElementOptions(i),
                i.pivot(),
                t = 0,
                n = s.length;
              t < n;
              ++t
            )
              a.updateElement(s[t], t, e);
            for (a.updateBezierControlPoints(), t = 0, n = s.length; t < n; ++t) s[t].pivot();
          },
          updateElement: function (e, t, n) {
            var a = this,
              r = e.custom || {},
              i = a.getDataset(),
              s = a.chart.scale,
              o = s.getPointPositionForValue(t, i.data[t]),
              d = a._resolveDataElementOptions(e, t),
              l = a.getMeta().dataset._model,
              u = n ? s.xCenter : o.x,
              _ = n ? s.yCenter : o.y;
            (e._scale = s),
              (e._options = d),
              (e._datasetIndex = a.index),
              (e._index = t),
              (e._model = {
                x: u,
                y: _,
                skip: r.skip || isNaN(u) || isNaN(_),
                radius: d.radius,
                pointStyle: d.pointStyle,
                rotation: d.rotation,
                backgroundColor: d.backgroundColor,
                borderColor: d.borderColor,
                borderWidth: d.borderWidth,
                tension: Ke(r.tension, l ? l.tension : 0),
                hitRadius: d.hitRadius,
              });
          },
          _resolveDatasetElementOptions: function () {
            var e = this,
              t = e._config,
              n = e.chart.options,
              a = ae.prototype._resolveDatasetElementOptions.apply(e, arguments);
            return (
              (a.spanGaps = Ke(t.spanGaps, n.spanGaps)), (a.tension = Ke(t.lineTension, n.elements.line.tension)), a
            );
          },
          updateBezierControlPoints: function () {
            var e,
              t,
              n,
              a,
              r = this.getMeta(),
              i = this.chart.chartArea,
              s = r.data || [];
            function o(e, t, n) {
              return Math.max(Math.min(e, n), t);
            }
            for (
              r.dataset._model.spanGaps &&
                (s = s.filter(function (e) {
                  return !e._model.skip;
                })),
                e = 0,
                t = s.length;
              e < t;
              ++e
            )
              (n = s[e]._model),
                (a = R.splineCurve(R.previousItem(s, e, !0)._model, n, R.nextItem(s, e, !0)._model, n.tension)),
                (n.controlPointPreviousX = o(a.previous.x, i.left, i.right)),
                (n.controlPointPreviousY = o(a.previous.y, i.top, i.bottom)),
                (n.controlPointNextX = o(a.next.x, i.left, i.right)),
                (n.controlPointNextY = o(a.next.y, i.top, i.bottom));
          },
          setHoverStyle: function (e) {
            var t = e._model,
              n = e._options,
              a = R.getHoverColor;
            (e.$previousStyle = {
              backgroundColor: t.backgroundColor,
              borderColor: t.borderColor,
              borderWidth: t.borderWidth,
              radius: t.radius,
            }),
              (t.backgroundColor = Ke(n.hoverBackgroundColor, a(n.backgroundColor))),
              (t.borderColor = Ke(n.hoverBorderColor, a(n.borderColor))),
              (t.borderWidth = Ke(n.hoverBorderWidth, n.borderWidth)),
              (t.radius = Ke(n.hoverRadius, n.radius));
          },
        });
        C._set('scatter', {
          hover: { mode: 'single' },
          scales: {
            xAxes: [{ id: 'x-axis-1', type: 'linear', position: 'bottom' }],
            yAxes: [{ id: 'y-axis-1', type: 'linear', position: 'left' }],
          },
          tooltips: {
            callbacks: {
              title: function () {
                return '';
              },
              label: function (e) {
                return '(' + e.xLabel + ', ' + e.yLabel + ')';
              },
            },
          },
        }),
          C._set('global', { datasets: { scatter: { showLine: !1 } } });
        var Xe = {
          bar: He,
          bubble: Oe,
          doughnut: Ee,
          horizontalBar: ze,
          line: Ue,
          polarArea: qe,
          pie: $e,
          radar: Ze,
          scatter: Ue,
        };
        function Qe(e, t) {
          return e.native ? { x: e.x, y: e.y } : R.getRelativePosition(e, t);
        }
        function et(e, t) {
          var n,
            a,
            r,
            i,
            s,
            o,
            d = e._getSortedVisibleDatasetMetas();
          for (a = 0, i = d.length; a < i; ++a)
            for (r = 0, s = (n = d[a].data).length; r < s; ++r) (o = n[r])._view.skip || t(o);
        }
        function tt(e, t) {
          var n = [];
          return (
            et(e, function (e) {
              e.inRange(t.x, t.y) && n.push(e);
            }),
            n
          );
        }
        function nt(e, t, n, a) {
          var r = Number.POSITIVE_INFINITY,
            i = [];
          return (
            et(e, function (e) {
              if (!n || e.inRange(t.x, t.y)) {
                var s = e.getCenterPoint(),
                  o = a(t, s);
                o < r ? ((i = [e]), (r = o)) : o === r && i.push(e);
              }
            }),
            i
          );
        }
        function at(e) {
          var t = -1 !== e.indexOf('x'),
            n = -1 !== e.indexOf('y');
          return function (e, a) {
            var r = t ? Math.abs(e.x - a.x) : 0,
              i = n ? Math.abs(e.y - a.y) : 0;
            return Math.sqrt(Math.pow(r, 2) + Math.pow(i, 2));
          };
        }
        function rt(e, t, n) {
          var a = Qe(t, e);
          n.axis = n.axis || 'x';
          var r = at(n.axis),
            i = n.intersect ? tt(e, a) : nt(e, a, !1, r),
            s = [];
          return i.length
            ? (e._getSortedVisibleDatasetMetas().forEach(function (e) {
                var t = e.data[i[0]._index];
                t && !t._view.skip && s.push(t);
              }),
              s)
            : [];
        }
        var it = {
            modes: {
              single: function (e, t) {
                var n = Qe(t, e),
                  a = [];
                return (
                  et(e, function (e) {
                    if (e.inRange(n.x, n.y)) return a.push(e), a;
                  }),
                  a.slice(0, 1)
                );
              },
              label: rt,
              index: rt,
              dataset: function (e, t, n) {
                var a = Qe(t, e);
                n.axis = n.axis || 'xy';
                var r = at(n.axis),
                  i = n.intersect ? tt(e, a) : nt(e, a, !1, r);
                return i.length > 0 && (i = e.getDatasetMeta(i[0]._datasetIndex).data), i;
              },
              'x-axis': function (e, t) {
                return rt(e, t, { intersect: !1 });
              },
              point: function (e, t) {
                return tt(e, Qe(t, e));
              },
              nearest: function (e, t, n) {
                var a = Qe(t, e);
                n.axis = n.axis || 'xy';
                var r = at(n.axis);
                return nt(e, a, n.intersect, r);
              },
              x: function (e, t, n) {
                var a = Qe(t, e),
                  r = [],
                  i = !1;
                return (
                  et(e, function (e) {
                    e.inXRange(a.x) && r.push(e), e.inRange(a.x, a.y) && (i = !0);
                  }),
                  n.intersect && !i && (r = []),
                  r
                );
              },
              y: function (e, t, n) {
                var a = Qe(t, e),
                  r = [],
                  i = !1;
                return (
                  et(e, function (e) {
                    e.inYRange(a.y) && r.push(e), e.inRange(a.x, a.y) && (i = !0);
                  }),
                  n.intersect && !i && (r = []),
                  r
                );
              },
            },
          },
          st = R.extend;
        function ot(e, t) {
          return R.where(e, function (e) {
            return e.pos === t;
          });
        }
        function dt(e, t) {
          return e.sort(function (e, n) {
            var a = t ? n : e,
              r = t ? e : n;
            return a.weight === r.weight ? a.index - r.index : a.weight - r.weight;
          });
        }
        function lt(e, t, n, a) {
          return Math.max(e[n], t[n]) + Math.max(e[a], t[a]);
        }
        function ut(e, t, n) {
          var a,
            r,
            i = n.box,
            s = e.maxPadding;
          if (
            (n.size && (e[n.pos] -= n.size),
            (n.size = n.horizontal ? i.height : i.width),
            (e[n.pos] += n.size),
            i.getPadding)
          ) {
            var o = i.getPadding();
            (s.top = Math.max(s.top, o.top)),
              (s.left = Math.max(s.left, o.left)),
              (s.bottom = Math.max(s.bottom, o.bottom)),
              (s.right = Math.max(s.right, o.right));
          }
          if (
            ((a = t.outerWidth - lt(s, e, 'left', 'right')),
            (r = t.outerHeight - lt(s, e, 'top', 'bottom')),
            a !== e.w || r !== e.h)
          ) {
            (e.w = a), (e.h = r);
            var d = n.horizontal ? [a, e.w] : [r, e.h];
            return !(d[0] === d[1] || (isNaN(d[0]) && isNaN(d[1])));
          }
        }
        function _t(e, t) {
          var n = t.maxPadding;
          function a(e) {
            var a = { left: 0, top: 0, right: 0, bottom: 0 };
            return (
              e.forEach(function (e) {
                a[e] = Math.max(t[e], n[e]);
              }),
              a
            );
          }
          return a(e ? ['left', 'right'] : ['top', 'bottom']);
        }
        function ct(e, t, n) {
          var a,
            r,
            i,
            s,
            o,
            d,
            l = [];
          for (a = 0, r = e.length; a < r; ++a)
            (s = (i = e[a]).box).update(i.width || t.w, i.height || t.h, _t(i.horizontal, t)),
              ut(t, n, i) && ((d = !0), l.length && (o = !0)),
              s.fullWidth || l.push(i);
          return (o && ct(l, t, n)) || d;
        }
        function ht(e, t, n) {
          var a,
            r,
            i,
            s,
            o = n.padding,
            d = t.x,
            l = t.y;
          for (a = 0, r = e.length; a < r; ++a)
            (s = (i = e[a]).box),
              i.horizontal
                ? ((s.left = s.fullWidth ? o.left : t.left),
                  (s.right = s.fullWidth ? n.outerWidth - o.right : t.left + t.w),
                  (s.top = l),
                  (s.bottom = l + s.height),
                  (s.width = s.right - s.left),
                  (l = s.bottom))
                : ((s.left = d),
                  (s.right = d + s.width),
                  (s.top = t.top),
                  (s.bottom = t.top + t.h),
                  (s.height = s.bottom - s.top),
                  (d = s.right));
          (t.x = d), (t.y = l);
        }
        C._set('global', { layout: { padding: { top: 0, right: 0, bottom: 0, left: 0 } } });
        var mt,
          ft = {
            defaults: {},
            addBox: function (e, t) {
              e.boxes || (e.boxes = []),
                (t.fullWidth = t.fullWidth || !1),
                (t.position = t.position || 'top'),
                (t.weight = t.weight || 0),
                (t._layers =
                  t._layers ||
                  function () {
                    return [
                      {
                        z: 0,
                        draw: function () {
                          t.draw.apply(t, arguments);
                        },
                      },
                    ];
                  }),
                e.boxes.push(t);
            },
            removeBox: function (e, t) {
              var n = e.boxes ? e.boxes.indexOf(t) : -1;
              -1 !== n && e.boxes.splice(n, 1);
            },
            configure: function (e, t, n) {
              for (var a, r = ['fullWidth', 'position', 'weight'], i = r.length, s = 0; s < i; ++s)
                (a = r[s]), n.hasOwnProperty(a) && (t[a] = n[a]);
            },
            update: function (e, t, n) {
              if (e) {
                var a = e.options.layout || {},
                  r = R.options.toPadding(a.padding),
                  i = t - r.width,
                  s = n - r.height,
                  o = (function (e) {
                    var t = (function (e) {
                        var t,
                          n,
                          a,
                          r = [];
                        for (t = 0, n = (e || []).length; t < n; ++t)
                          (a = e[t]),
                            r.push({
                              index: t,
                              box: a,
                              pos: a.position,
                              horizontal: a.isHorizontal(),
                              weight: a.weight,
                            });
                        return r;
                      })(e),
                      n = dt(ot(t, 'left'), !0),
                      a = dt(ot(t, 'right')),
                      r = dt(ot(t, 'top'), !0),
                      i = dt(ot(t, 'bottom'));
                    return {
                      leftAndTop: n.concat(r),
                      rightAndBottom: a.concat(i),
                      chartArea: ot(t, 'chartArea'),
                      vertical: n.concat(a),
                      horizontal: r.concat(i),
                    };
                  })(e.boxes),
                  d = o.vertical,
                  l = o.horizontal,
                  u = Object.freeze({
                    outerWidth: t,
                    outerHeight: n,
                    padding: r,
                    availableWidth: i,
                    vBoxMaxWidth: i / 2 / d.length,
                    hBoxMaxHeight: s / 2,
                  }),
                  _ = st({ maxPadding: st({}, r), w: i, h: s, x: r.left, y: r.top }, r);
                !(function (e, t) {
                  var n, a, r;
                  for (n = 0, a = e.length; n < a; ++n)
                    ((r = e[n]).width = r.horizontal ? r.box.fullWidth && t.availableWidth : t.vBoxMaxWidth),
                      (r.height = r.horizontal && t.hBoxMaxHeight);
                })(d.concat(l), u),
                  ct(d, _, u),
                  ct(l, _, u) && ct(d, _, u),
                  (function (e) {
                    var t = e.maxPadding;
                    function n(n) {
                      var a = Math.max(t[n] - e[n], 0);
                      return (e[n] += a), a;
                    }
                    (e.y += n('top')), (e.x += n('left')), n('right'), n('bottom');
                  })(_),
                  ht(o.leftAndTop, _, u),
                  (_.x += _.w),
                  (_.y += _.h),
                  ht(o.rightAndBottom, _, u),
                  (e.chartArea = { left: _.left, top: _.top, right: _.left + _.w, bottom: _.top + _.h }),
                  R.each(o.chartArea, function (t) {
                    var n = t.box;
                    st(n, e.chartArea), n.update(_.w, _.h);
                  });
              }
            },
          },
          pt =
            ((mt = Object.freeze({
              __proto__: null,
              default:
                '/*\r\n * DOM element rendering detection\r\n * https://davidwalsh.name/detect-node-insertion\r\n */\r\n@keyframes chartjs-render-animation {\r\n\tfrom { opacity: 0.99; }\r\n\tto { opacity: 1; }\r\n}\r\n\r\n.chartjs-render-monitor {\r\n\tanimation: chartjs-render-animation 0.001s;\r\n}\r\n\r\n/*\r\n * DOM element resizing detection\r\n * https://github.com/marcj/css-element-queries\r\n */\r\n.chartjs-size-monitor,\r\n.chartjs-size-monitor-expand,\r\n.chartjs-size-monitor-shrink {\r\n\tposition: absolute;\r\n\tdirection: ltr;\r\n\tleft: 0;\r\n\ttop: 0;\r\n\tright: 0;\r\n\tbottom: 0;\r\n\toverflow: hidden;\r\n\tpointer-events: none;\r\n\tvisibility: hidden;\r\n\tz-index: -1;\r\n}\r\n\r\n.chartjs-size-monitor-expand > div {\r\n\tposition: absolute;\r\n\twidth: 1000000px;\r\n\theight: 1000000px;\r\n\tleft: 0;\r\n\ttop: 0;\r\n}\r\n\r\n.chartjs-size-monitor-shrink > div {\r\n\tposition: absolute;\r\n\twidth: 200%;\r\n\theight: 200%;\r\n\tleft: 0;\r\n\ttop: 0;\r\n}\r\n',
            })) &&
              mt.default) ||
            mt,
          Mt = ['animationstart', 'webkitAnimationStart'],
          yt = {
            touchstart: 'mousedown',
            touchmove: 'mousemove',
            touchend: 'mouseup',
            pointerenter: 'mouseenter',
            pointerdown: 'mousedown',
            pointermove: 'mousemove',
            pointerup: 'mouseup',
            pointerleave: 'mouseout',
            pointerout: 'mouseout',
          };
        function gt(e, t) {
          var n = R.getStyle(e, t),
            a = n && n.match(/^(\d+)(\.\d+)?px$/);
          return a ? Number(a[1]) : void 0;
        }
        var Lt = !!(function () {
          var e = !1;
          try {
            var t = Object.defineProperty({}, 'passive', {
              get: function () {
                e = !0;
              },
            });
            window.addEventListener('e', null, t);
          } catch (e) {}
          return e;
        })() && { passive: !0 };
        function vt(e, t, n) {
          e.addEventListener(t, n, Lt);
        }
        function Yt(e, t, n) {
          e.removeEventListener(t, n, Lt);
        }
        function bt(e, t, n, a, r) {
          return { type: e, chart: t, native: r || null, x: void 0 !== n ? n : null, y: void 0 !== a ? a : null };
        }
        function kt(e) {
          var t = document.createElement('div');
          return (t.className = e || ''), t;
        }
        function Dt(e, t, n) {
          var a,
            r,
            i,
            s,
            o = e.$chartjs || (e.$chartjs = {}),
            d = (o.resizer = (function (e) {
              var t = kt('chartjs-size-monitor'),
                n = kt('chartjs-size-monitor-expand'),
                a = kt('chartjs-size-monitor-shrink');
              n.appendChild(kt()),
                a.appendChild(kt()),
                t.appendChild(n),
                t.appendChild(a),
                (t._reset = function () {
                  (n.scrollLeft = 1e6), (n.scrollTop = 1e6), (a.scrollLeft = 1e6), (a.scrollTop = 1e6);
                });
              var r = function () {
                t._reset(), e();
              };
              return vt(n, 'scroll', r.bind(n, 'expand')), vt(a, 'scroll', r.bind(a, 'shrink')), t;
            })(
              ((a = function () {
                if (o.resizer) {
                  var a = n.options.maintainAspectRatio && e.parentNode,
                    r = a ? a.clientWidth : 0;
                  t(bt('resize', n)), a && a.clientWidth < r && n.canvas && t(bt('resize', n));
                }
              }),
              (i = !1),
              (s = []),
              function () {
                (s = Array.prototype.slice.call(arguments)),
                  (r = r || this),
                  i ||
                    ((i = !0),
                    R.requestAnimFrame.call(window, function () {
                      (i = !1), a.apply(r, s);
                    }));
              }),
            ));
          !(function (e, t) {
            var n = e.$chartjs || (e.$chartjs = {}),
              a = (n.renderProxy = function (e) {
                'chartjs-render-animation' === e.animationName && t();
              });
            R.each(Mt, function (t) {
              vt(e, t, a);
            }),
              (n.reflow = !!e.offsetParent),
              e.classList.add('chartjs-render-monitor');
          })(e, function () {
            if (o.resizer) {
              var t = e.parentNode;
              t && t !== d.parentNode && t.insertBefore(d, t.firstChild), d._reset();
            }
          });
        }
        function wt(e) {
          var t = e.$chartjs || {},
            n = t.resizer;
          delete t.resizer,
            (function (e) {
              var t = e.$chartjs || {},
                n = t.renderProxy;
              n &&
                (R.each(Mt, function (t) {
                  Yt(e, t, n);
                }),
                delete t.renderProxy),
                e.classList.remove('chartjs-render-monitor');
            })(e),
            n && n.parentNode && n.parentNode.removeChild(n);
        }
        var xt = {
          disableCSSInjection: !1,
          _enabled: 'undefined' != typeof window && 'undefined' != typeof document,
          _ensureLoaded: function (e) {
            if (!this.disableCSSInjection) {
              var t = e.getRootNode ? e.getRootNode() : document;
              !(function (e, t) {
                var n = e.$chartjs || (e.$chartjs = {});
                if (!n.containsStyles) {
                  (n.containsStyles = !0), (t = '/* Chart.js */\n' + t);
                  var a = document.createElement('style');
                  a.setAttribute('type', 'text/css'), a.appendChild(document.createTextNode(t)), e.appendChild(a);
                }
              })(t.host ? t : document.head, pt);
            }
          },
          acquireContext: function (e, t) {
            'string' == typeof e ? (e = document.getElementById(e)) : e.length && (e = e[0]),
              e && e.canvas && (e = e.canvas);
            var n = e && e.getContext && e.getContext('2d');
            return n && n.canvas === e
              ? (this._ensureLoaded(e),
                (function (e, t) {
                  var n = e.style,
                    a = e.getAttribute('height'),
                    r = e.getAttribute('width');
                  if (
                    ((e.$chartjs = {
                      initial: { height: a, width: r, style: { display: n.display, height: n.height, width: n.width } },
                    }),
                    (n.display = n.display || 'block'),
                    null === r || '' === r)
                  ) {
                    var i = gt(e, 'width');
                    void 0 !== i && (e.width = i);
                  }
                  if (null === a || '' === a)
                    if ('' === e.style.height) e.height = e.width / (t.options.aspectRatio || 2);
                    else {
                      var s = gt(e, 'height');
                      void 0 !== i && (e.height = s);
                    }
                })(e, t),
                n)
              : null;
          },
          releaseContext: function (e) {
            var t = e.canvas;
            if (t.$chartjs) {
              var n = t.$chartjs.initial;
              ['height', 'width'].forEach(function (e) {
                var a = n[e];
                R.isNullOrUndef(a) ? t.removeAttribute(e) : t.setAttribute(e, a);
              }),
                R.each(n.style || {}, function (e, n) {
                  t.style[n] = e;
                }),
                (t.width = t.width),
                delete t.$chartjs;
            }
          },
          addEventListener: function (e, t, n) {
            var a = e.canvas;
            if ('resize' !== t) {
              var r = n.$chartjs || (n.$chartjs = {});
              vt(
                a,
                t,
                ((r.proxies || (r.proxies = {}))[e.id + '_' + t] = function (t) {
                  n(
                    (function (e, t) {
                      var n = yt[e.type] || e.type,
                        a = R.getRelativePosition(e, t);
                      return bt(n, t, a.x, a.y, e);
                    })(t, e),
                  );
                }),
              );
            } else Dt(a, n, e);
          },
          removeEventListener: function (e, t, n) {
            var a = e.canvas;
            if ('resize' !== t) {
              var r = ((n.$chartjs || {}).proxies || {})[e.id + '_' + t];
              r && Yt(a, t, r);
            } else wt(a);
          },
        };
        (R.addEvent = vt), (R.removeEvent = Yt);
        var Tt = xt._enabled
            ? xt
            : {
                acquireContext: function (e) {
                  return e && e.canvas && (e = e.canvas), (e && e.getContext('2d')) || null;
                },
              },
          St = R.extend(
            {
              initialize: function () {},
              acquireContext: function () {},
              releaseContext: function () {},
              addEventListener: function () {},
              removeEventListener: function () {},
            },
            Tt,
          );
        C._set('global', { plugins: {} });
        var Ht = {
            _plugins: [],
            _cacheId: 0,
            register: function (e) {
              var t = this._plugins;
              [].concat(e).forEach(function (e) {
                -1 === t.indexOf(e) && t.push(e);
              }),
                this._cacheId++;
            },
            unregister: function (e) {
              var t = this._plugins;
              [].concat(e).forEach(function (e) {
                var n = t.indexOf(e);
                -1 !== n && t.splice(n, 1);
              }),
                this._cacheId++;
            },
            clear: function () {
              (this._plugins = []), this._cacheId++;
            },
            count: function () {
              return this._plugins.length;
            },
            getAll: function () {
              return this._plugins;
            },
            notify: function (e, t, n) {
              var a,
                r,
                i,
                s,
                o,
                d = this.descriptors(e),
                l = d.length;
              for (a = 0; a < l; ++a)
                if (
                  'function' == typeof (o = (i = (r = d[a]).plugin)[t]) &&
                  ((s = [e].concat(n || [])).push(r.options), !1 === o.apply(i, s))
                )
                  return !1;
              return !0;
            },
            descriptors: function (e) {
              var t = e.$plugins || (e.$plugins = {});
              if (t.id === this._cacheId) return t.descriptors;
              var n = [],
                a = [],
                r = (e && e.config) || {},
                i = (r.options && r.options.plugins) || {};
              return (
                this._plugins.concat(r.plugins || []).forEach(function (e) {
                  if (-1 === n.indexOf(e)) {
                    var t = e.id,
                      r = i[t];
                    !1 !== r &&
                      (!0 === r && (r = R.clone(C.global.plugins[t])),
                      n.push(e),
                      a.push({ plugin: e, options: r || {} }));
                  }
                }),
                (t.descriptors = a),
                (t.id = this._cacheId),
                a
              );
            },
            _invalidate: function (e) {
              delete e.$plugins;
            },
          },
          jt = {
            constructors: {},
            defaults: {},
            registerScaleType: function (e, t, n) {
              (this.constructors[e] = t), (this.defaults[e] = R.clone(n));
            },
            getScaleConstructor: function (e) {
              return this.constructors.hasOwnProperty(e) ? this.constructors[e] : void 0;
            },
            getScaleDefaults: function (e) {
              return this.defaults.hasOwnProperty(e) ? R.merge(Object.create(null), [C.scale, this.defaults[e]]) : {};
            },
            updateScaleDefaults: function (e, t) {
              this.defaults.hasOwnProperty(e) && (this.defaults[e] = R.extend(this.defaults[e], t));
            },
            addScalesToLayout: function (e) {
              R.each(e.scales, function (t) {
                (t.fullWidth = t.options.fullWidth),
                  (t.position = t.options.position),
                  (t.weight = t.options.weight),
                  ft.addBox(e, t);
              });
            },
          },
          Pt = R.valueOrDefault,
          Ot = R.rtl.getRtlAdapter;
        C._set('global', {
          tooltips: {
            enabled: !0,
            custom: null,
            mode: 'nearest',
            position: 'average',
            intersect: !0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFontStyle: 'bold',
            titleSpacing: 2,
            titleMarginBottom: 6,
            titleFontColor: '#fff',
            titleAlign: 'left',
            bodySpacing: 2,
            bodyFontColor: '#fff',
            bodyAlign: 'left',
            footerFontStyle: 'bold',
            footerSpacing: 2,
            footerMarginTop: 6,
            footerFontColor: '#fff',
            footerAlign: 'left',
            yPadding: 6,
            xPadding: 6,
            caretPadding: 2,
            caretSize: 5,
            cornerRadius: 6,
            multiKeyBackground: '#fff',
            displayColors: !0,
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 0,
            callbacks: {
              beforeTitle: R.noop,
              title: function (e, t) {
                var n = '',
                  a = t.labels,
                  r = a ? a.length : 0;
                if (e.length > 0) {
                  var i = e[0];
                  i.label ? (n = i.label) : i.xLabel ? (n = i.xLabel) : r > 0 && i.index < r && (n = a[i.index]);
                }
                return n;
              },
              afterTitle: R.noop,
              beforeBody: R.noop,
              beforeLabel: R.noop,
              label: function (e, t) {
                var n = t.datasets[e.datasetIndex].label || '';
                return n && (n += ': '), R.isNullOrUndef(e.value) ? (n += e.yLabel) : (n += e.value), n;
              },
              labelColor: function (e, t) {
                var n = t.getDatasetMeta(e.datasetIndex).data[e.index]._view;
                return { borderColor: n.borderColor, backgroundColor: n.backgroundColor };
              },
              labelTextColor: function () {
                return this._options.bodyFontColor;
              },
              afterLabel: R.noop,
              afterBody: R.noop,
              beforeFooter: R.noop,
              footer: R.noop,
              afterFooter: R.noop,
            },
          },
        });
        var At = {
          average: function (e) {
            if (!e.length) return !1;
            var t,
              n,
              a = 0,
              r = 0,
              i = 0;
            for (t = 0, n = e.length; t < n; ++t) {
              var s = e[t];
              if (s && s.hasValue()) {
                var o = s.tooltipPosition();
                (a += o.x), (r += o.y), ++i;
              }
            }
            return { x: a / i, y: r / i };
          },
          nearest: function (e, t) {
            var n,
              a,
              r,
              i = t.x,
              s = t.y,
              o = Number.POSITIVE_INFINITY;
            for (n = 0, a = e.length; n < a; ++n) {
              var d = e[n];
              if (d && d.hasValue()) {
                var l = d.getCenterPoint(),
                  u = R.distanceBetweenPoints(t, l);
                u < o && ((o = u), (r = d));
              }
            }
            if (r) {
              var _ = r.tooltipPosition();
              (i = _.x), (s = _.y);
            }
            return { x: i, y: s };
          },
        };
        function Ft(e, t) {
          return t && (R.isArray(t) ? Array.prototype.push.apply(e, t) : e.push(t)), e;
        }
        function Wt(e) {
          return ('string' == typeof e || e instanceof String) && e.indexOf('\n') > -1 ? e.split('\n') : e;
        }
        function Ct(e) {
          var t = C.global;
          return {
            xPadding: e.xPadding,
            yPadding: e.yPadding,
            xAlign: e.xAlign,
            yAlign: e.yAlign,
            rtl: e.rtl,
            textDirection: e.textDirection,
            bodyFontColor: e.bodyFontColor,
            _bodyFontFamily: Pt(e.bodyFontFamily, t.defaultFontFamily),
            _bodyFontStyle: Pt(e.bodyFontStyle, t.defaultFontStyle),
            _bodyAlign: e.bodyAlign,
            bodyFontSize: Pt(e.bodyFontSize, t.defaultFontSize),
            bodySpacing: e.bodySpacing,
            titleFontColor: e.titleFontColor,
            _titleFontFamily: Pt(e.titleFontFamily, t.defaultFontFamily),
            _titleFontStyle: Pt(e.titleFontStyle, t.defaultFontStyle),
            titleFontSize: Pt(e.titleFontSize, t.defaultFontSize),
            _titleAlign: e.titleAlign,
            titleSpacing: e.titleSpacing,
            titleMarginBottom: e.titleMarginBottom,
            footerFontColor: e.footerFontColor,
            _footerFontFamily: Pt(e.footerFontFamily, t.defaultFontFamily),
            _footerFontStyle: Pt(e.footerFontStyle, t.defaultFontStyle),
            footerFontSize: Pt(e.footerFontSize, t.defaultFontSize),
            _footerAlign: e.footerAlign,
            footerSpacing: e.footerSpacing,
            footerMarginTop: e.footerMarginTop,
            caretSize: e.caretSize,
            cornerRadius: e.cornerRadius,
            backgroundColor: e.backgroundColor,
            opacity: 0,
            legendColorBackground: e.multiKeyBackground,
            displayColors: e.displayColors,
            borderColor: e.borderColor,
            borderWidth: e.borderWidth,
          };
        }
        function Et(e, t) {
          return 'center' === t ? e.x + e.width / 2 : 'right' === t ? e.x + e.width - e.xPadding : e.x + e.xPadding;
        }
        function zt(e) {
          return Ft([], Wt(e));
        }
        var It = $.extend({
            initialize: function () {
              (this._model = Ct(this._options)), (this._lastActive = []);
            },
            getTitle: function () {
              var e = this,
                t = e._options,
                n = t.callbacks,
                a = n.beforeTitle.apply(e, arguments),
                r = n.title.apply(e, arguments),
                i = n.afterTitle.apply(e, arguments),
                s = [];
              return (s = Ft(s, Wt(a))), (s = Ft(s, Wt(r))), (s = Ft(s, Wt(i)));
            },
            getBeforeBody: function () {
              return zt(this._options.callbacks.beforeBody.apply(this, arguments));
            },
            getBody: function (e, t) {
              var n = this,
                a = n._options.callbacks,
                r = [];
              return (
                R.each(e, function (e) {
                  var i = { before: [], lines: [], after: [] };
                  Ft(i.before, Wt(a.beforeLabel.call(n, e, t))),
                    Ft(i.lines, a.label.call(n, e, t)),
                    Ft(i.after, Wt(a.afterLabel.call(n, e, t))),
                    r.push(i);
                }),
                r
              );
            },
            getAfterBody: function () {
              return zt(this._options.callbacks.afterBody.apply(this, arguments));
            },
            getFooter: function () {
              var e = this,
                t = e._options.callbacks,
                n = t.beforeFooter.apply(e, arguments),
                a = t.footer.apply(e, arguments),
                r = t.afterFooter.apply(e, arguments),
                i = [];
              return (i = Ft(i, Wt(n))), (i = Ft(i, Wt(a))), (i = Ft(i, Wt(r)));
            },
            update: function (e) {
              var t,
                n,
                a,
                r,
                i,
                s,
                o,
                d,
                l,
                u,
                _ = this,
                c = _._options,
                h = _._model,
                m = (_._model = Ct(c)),
                f = _._active,
                p = _._data,
                M = { xAlign: h.xAlign, yAlign: h.yAlign },
                y = { x: h.x, y: h.y },
                g = { width: h.width, height: h.height },
                L = { x: h.caretX, y: h.caretY };
              if (f.length) {
                m.opacity = 1;
                var v = [],
                  Y = [];
                L = At[c.position].call(_, f, _._eventPosition);
                var b = [];
                for (t = 0, n = f.length; t < n; ++t)
                  b.push(
                    ((a = f[t]),
                    (r = void 0),
                    (i = void 0),
                    (s = void 0),
                    (o = void 0),
                    (d = void 0),
                    (l = void 0),
                    (u = void 0),
                    (r = a._xScale),
                    (i = a._yScale || a._scale),
                    (s = a._index),
                    (o = a._datasetIndex),
                    (d = a._chart.getDatasetMeta(o).controller),
                    (l = d._getIndexScale()),
                    (u = d._getValueScale()),
                    {
                      xLabel: r ? r.getLabelForIndex(s, o) : '',
                      yLabel: i ? i.getLabelForIndex(s, o) : '',
                      label: l ? '' + l.getLabelForIndex(s, o) : '',
                      value: u ? '' + u.getLabelForIndex(s, o) : '',
                      index: s,
                      datasetIndex: o,
                      x: a._model.x,
                      y: a._model.y,
                    }),
                  );
                c.filter &&
                  (b = b.filter(function (e) {
                    return c.filter(e, p);
                  })),
                  c.itemSort &&
                    (b = b.sort(function (e, t) {
                      return c.itemSort(e, t, p);
                    })),
                  R.each(b, function (e) {
                    v.push(c.callbacks.labelColor.call(_, e, _._chart)),
                      Y.push(c.callbacks.labelTextColor.call(_, e, _._chart));
                  }),
                  (m.title = _.getTitle(b, p)),
                  (m.beforeBody = _.getBeforeBody(b, p)),
                  (m.body = _.getBody(b, p)),
                  (m.afterBody = _.getAfterBody(b, p)),
                  (m.footer = _.getFooter(b, p)),
                  (m.x = L.x),
                  (m.y = L.y),
                  (m.caretPadding = c.caretPadding),
                  (m.labelColors = v),
                  (m.labelTextColors = Y),
                  (m.dataPoints = b),
                  (g = (function (e, t) {
                    var n = e._chart.ctx,
                      a = 2 * t.yPadding,
                      r = 0,
                      i = t.body,
                      s = i.reduce(function (e, t) {
                        return e + t.before.length + t.lines.length + t.after.length;
                      }, 0);
                    s += t.beforeBody.length + t.afterBody.length;
                    var o = t.title.length,
                      d = t.footer.length,
                      l = t.titleFontSize,
                      u = t.bodyFontSize,
                      _ = t.footerFontSize;
                    (a += o * l),
                      (a += o ? (o - 1) * t.titleSpacing : 0),
                      (a += o ? t.titleMarginBottom : 0),
                      (a += s * u),
                      (a += s ? (s - 1) * t.bodySpacing : 0),
                      (a += d ? t.footerMarginTop : 0),
                      (a += d * _),
                      (a += d ? (d - 1) * t.footerSpacing : 0);
                    var c = 0,
                      h = function (e) {
                        r = Math.max(r, n.measureText(e).width + c);
                      };
                    return (
                      (n.font = R.fontString(l, t._titleFontStyle, t._titleFontFamily)),
                      R.each(t.title, h),
                      (n.font = R.fontString(u, t._bodyFontStyle, t._bodyFontFamily)),
                      R.each(t.beforeBody.concat(t.afterBody), h),
                      (c = t.displayColors ? u + 2 : 0),
                      R.each(i, function (e) {
                        R.each(e.before, h), R.each(e.lines, h), R.each(e.after, h);
                      }),
                      (c = 0),
                      (n.font = R.fontString(_, t._footerFontStyle, t._footerFontFamily)),
                      R.each(t.footer, h),
                      { width: (r += 2 * t.xPadding), height: a }
                    );
                  })(this, m)),
                  (y = (function (e, t, n, a) {
                    var r = e.x,
                      i = e.y,
                      s = e.caretSize,
                      o = e.caretPadding,
                      d = e.cornerRadius,
                      l = n.xAlign,
                      u = n.yAlign,
                      _ = s + o,
                      c = d + o;
                    return (
                      'right' === l
                        ? (r -= t.width)
                        : 'center' === l &&
                          ((r -= t.width / 2) + t.width > a.width && (r = a.width - t.width), r < 0 && (r = 0)),
                      'top' === u ? (i += _) : (i -= 'bottom' === u ? t.height + _ : t.height / 2),
                      'center' === u
                        ? 'left' === l
                          ? (r += _)
                          : 'right' === l && (r -= _)
                        : 'left' === l
                        ? (r -= c)
                        : 'right' === l && (r += c),
                      { x: r, y: i }
                    );
                  })(
                    m,
                    g,
                    (M = (function (e, t) {
                      var n,
                        a,
                        r,
                        i,
                        s,
                        o = e._model,
                        d = e._chart,
                        l = e._chart.chartArea,
                        u = 'center',
                        _ = 'center';
                      o.y < t.height ? (_ = 'top') : o.y > d.height - t.height && (_ = 'bottom');
                      var c = (l.left + l.right) / 2,
                        h = (l.top + l.bottom) / 2;
                      'center' === _
                        ? ((n = function (e) {
                            return e <= c;
                          }),
                          (a = function (e) {
                            return e > c;
                          }))
                        : ((n = function (e) {
                            return e <= t.width / 2;
                          }),
                          (a = function (e) {
                            return e >= d.width - t.width / 2;
                          })),
                        (r = function (e) {
                          return e + t.width + o.caretSize + o.caretPadding > d.width;
                        }),
                        (i = function (e) {
                          return e - t.width - o.caretSize - o.caretPadding < 0;
                        }),
                        (s = function (e) {
                          return e <= h ? 'top' : 'bottom';
                        }),
                        n(o.x)
                          ? ((u = 'left'), r(o.x) && ((u = 'center'), (_ = s(o.y))))
                          : a(o.x) && ((u = 'right'), i(o.x) && ((u = 'center'), (_ = s(o.y))));
                      var m = e._options;
                      return { xAlign: m.xAlign ? m.xAlign : u, yAlign: m.yAlign ? m.yAlign : _ };
                    })(this, g)),
                    _._chart,
                  ));
              } else m.opacity = 0;
              return (
                (m.xAlign = M.xAlign),
                (m.yAlign = M.yAlign),
                (m.x = y.x),
                (m.y = y.y),
                (m.width = g.width),
                (m.height = g.height),
                (m.caretX = L.x),
                (m.caretY = L.y),
                (_._model = m),
                e && c.custom && c.custom.call(_, m),
                _
              );
            },
            drawCaret: function (e, t) {
              var n = this._chart.ctx,
                a = this._view,
                r = this.getCaretPosition(e, t, a);
              n.lineTo(r.x1, r.y1), n.lineTo(r.x2, r.y2), n.lineTo(r.x3, r.y3);
            },
            getCaretPosition: function (e, t, n) {
              var a,
                r,
                i,
                s,
                o,
                d,
                l = n.caretSize,
                u = n.cornerRadius,
                _ = n.xAlign,
                c = n.yAlign,
                h = e.x,
                m = e.y,
                f = t.width,
                p = t.height;
              if ('center' === c)
                (o = m + p / 2),
                  'left' === _
                    ? ((r = (a = h) - l), (i = a), (s = o + l), (d = o - l))
                    : ((r = (a = h + f) + l), (i = a), (s = o - l), (d = o + l));
              else if (
                ('left' === _
                  ? ((a = (r = h + u + l) - l), (i = r + l))
                  : 'right' === _
                  ? ((a = (r = h + f - u - l) - l), (i = r + l))
                  : ((a = (r = n.caretX) - l), (i = r + l)),
                'top' === c)
              )
                (o = (s = m) - l), (d = s);
              else {
                (o = (s = m + p) + l), (d = s);
                var M = i;
                (i = a), (a = M);
              }
              return { x1: a, x2: r, x3: i, y1: s, y2: o, y3: d };
            },
            drawTitle: function (e, t, n) {
              var a,
                r,
                i,
                s = t.title,
                o = s.length;
              if (o) {
                var d = Ot(t.rtl, t.x, t.width);
                for (
                  e.x = Et(t, t._titleAlign),
                    n.textAlign = d.textAlign(t._titleAlign),
                    n.textBaseline = 'middle',
                    a = t.titleFontSize,
                    r = t.titleSpacing,
                    n.fillStyle = t.titleFontColor,
                    n.font = R.fontString(a, t._titleFontStyle, t._titleFontFamily),
                    i = 0;
                  i < o;
                  ++i
                )
                  n.fillText(s[i], d.x(e.x), e.y + a / 2),
                    (e.y += a + r),
                    i + 1 === o && (e.y += t.titleMarginBottom - r);
              }
            },
            drawBody: function (e, t, n) {
              var a,
                r,
                i,
                s,
                o,
                d,
                l,
                u,
                _ = t.bodyFontSize,
                c = t.bodySpacing,
                h = t._bodyAlign,
                m = t.body,
                f = t.displayColors,
                p = 0,
                M = f ? Et(t, 'left') : 0,
                y = Ot(t.rtl, t.x, t.width),
                g = function (t) {
                  n.fillText(t, y.x(e.x + p), e.y + _ / 2), (e.y += _ + c);
                },
                L = y.textAlign(h);
              for (
                n.textAlign = h,
                  n.textBaseline = 'middle',
                  n.font = R.fontString(_, t._bodyFontStyle, t._bodyFontFamily),
                  e.x = Et(t, L),
                  n.fillStyle = t.bodyFontColor,
                  R.each(t.beforeBody, g),
                  p = f && 'right' !== L ? ('center' === h ? _ / 2 + 1 : _ + 2) : 0,
                  o = 0,
                  l = m.length;
                o < l;
                ++o
              ) {
                for (
                  a = m[o],
                    r = t.labelTextColors[o],
                    i = t.labelColors[o],
                    n.fillStyle = r,
                    R.each(a.before, g),
                    d = 0,
                    u = (s = a.lines).length;
                  d < u;
                  ++d
                ) {
                  if (f) {
                    var v = y.x(M);
                    (n.fillStyle = t.legendColorBackground),
                      n.fillRect(y.leftForLtr(v, _), e.y, _, _),
                      (n.lineWidth = 1),
                      (n.strokeStyle = i.borderColor),
                      n.strokeRect(y.leftForLtr(v, _), e.y, _, _),
                      (n.fillStyle = i.backgroundColor),
                      n.fillRect(y.leftForLtr(y.xPlus(v, 1), _ - 2), e.y + 1, _ - 2, _ - 2),
                      (n.fillStyle = r);
                  }
                  g(s[d]);
                }
                R.each(a.after, g);
              }
              (p = 0), R.each(t.afterBody, g), (e.y -= c);
            },
            drawFooter: function (e, t, n) {
              var a,
                r,
                i = t.footer,
                s = i.length;
              if (s) {
                var o = Ot(t.rtl, t.x, t.width);
                for (
                  e.x = Et(t, t._footerAlign),
                    e.y += t.footerMarginTop,
                    n.textAlign = o.textAlign(t._footerAlign),
                    n.textBaseline = 'middle',
                    a = t.footerFontSize,
                    n.fillStyle = t.footerFontColor,
                    n.font = R.fontString(a, t._footerFontStyle, t._footerFontFamily),
                    r = 0;
                  r < s;
                  ++r
                )
                  n.fillText(i[r], o.x(e.x), e.y + a / 2), (e.y += a + t.footerSpacing);
              }
            },
            drawBackground: function (e, t, n, a) {
              (n.fillStyle = t.backgroundColor), (n.strokeStyle = t.borderColor), (n.lineWidth = t.borderWidth);
              var r = t.xAlign,
                i = t.yAlign,
                s = e.x,
                o = e.y,
                d = a.width,
                l = a.height,
                u = t.cornerRadius;
              n.beginPath(),
                n.moveTo(s + u, o),
                'top' === i && this.drawCaret(e, a),
                n.lineTo(s + d - u, o),
                n.quadraticCurveTo(s + d, o, s + d, o + u),
                'center' === i && 'right' === r && this.drawCaret(e, a),
                n.lineTo(s + d, o + l - u),
                n.quadraticCurveTo(s + d, o + l, s + d - u, o + l),
                'bottom' === i && this.drawCaret(e, a),
                n.lineTo(s + u, o + l),
                n.quadraticCurveTo(s, o + l, s, o + l - u),
                'center' === i && 'left' === r && this.drawCaret(e, a),
                n.lineTo(s, o + u),
                n.quadraticCurveTo(s, o, s + u, o),
                n.closePath(),
                n.fill(),
                t.borderWidth > 0 && n.stroke();
            },
            draw: function () {
              var e = this._chart.ctx,
                t = this._view;
              if (0 !== t.opacity) {
                var n = { width: t.width, height: t.height },
                  a = { x: t.x, y: t.y },
                  r = Math.abs(t.opacity < 0.001) ? 0 : t.opacity,
                  i = t.title.length || t.beforeBody.length || t.body.length || t.afterBody.length || t.footer.length;
                this._options.enabled &&
                  i &&
                  (e.save(),
                  (e.globalAlpha = r),
                  this.drawBackground(a, t, e, n),
                  (a.y += t.yPadding),
                  R.rtl.overrideTextDirection(e, t.textDirection),
                  this.drawTitle(a, t, e),
                  this.drawBody(a, t, e),
                  this.drawFooter(a, t, e),
                  R.rtl.restoreTextDirection(e, t.textDirection),
                  e.restore());
              }
            },
            handleEvent: function (e) {
              var t,
                n = this,
                a = n._options;
              return (
                (n._lastActive = n._lastActive || []),
                'mouseout' === e.type
                  ? (n._active = [])
                  : ((n._active = n._chart.getElementsAtEventForMode(e, a.mode, a)), a.reverse && n._active.reverse()),
                (t = !R.arrayEquals(n._active, n._lastActive)) &&
                  ((n._lastActive = n._active),
                  (a.enabled || a.custom) && ((n._eventPosition = { x: e.x, y: e.y }), n.update(!0), n.pivot())),
                t
              );
            },
          }),
          Nt = At,
          Rt = It;
        Rt.positioners = Nt;
        var Vt = R.valueOrDefault;
        function Bt() {
          return R.merge(Object.create(null), [].slice.call(arguments), {
            merger: function (e, t, n, a) {
              if ('xAxes' === e || 'yAxes' === e) {
                var r,
                  i,
                  s,
                  o = n[e].length;
                for (t[e] || (t[e] = []), r = 0; r < o; ++r)
                  (s = n[e][r]),
                    (i = Vt(s.type, 'xAxes' === e ? 'category' : 'linear')),
                    r >= t[e].length && t[e].push({}),
                    !t[e][r].type || (s.type && s.type !== t[e][r].type)
                      ? R.merge(t[e][r], [jt.getScaleDefaults(i), s])
                      : R.merge(t[e][r], s);
              } else R._merger(e, t, n, a);
            },
          });
        }
        function Jt() {
          return R.merge(Object.create(null), [].slice.call(arguments), {
            merger: function (e, t, n, a) {
              var r = t[e] || Object.create(null),
                i = n[e];
              'scales' === e
                ? (t[e] = Bt(r, i))
                : 'scale' === e
                ? (t[e] = R.merge(r, [jt.getScaleDefaults(i.type), i]))
                : R._merger(e, t, n, a);
            },
          });
        }
        function Ut(e) {
          var t = e.options;
          R.each(e.scales, function (t) {
            ft.removeBox(e, t);
          }),
            (t = Jt(C.global, C[e.config.type], t)),
            (e.options = e.config.options = t),
            e.ensureScalesHaveIDs(),
            e.buildOrUpdateScales(),
            (e.tooltip._options = t.tooltips),
            e.tooltip.initialize();
        }
        function Gt(e, t, n) {
          var a,
            r = function (e) {
              return e.id === a;
            };
          do {
            a = t + n++;
          } while (R.findIndex(e, r) >= 0);
          return a;
        }
        function qt(e) {
          return 'top' === e || 'bottom' === e;
        }
        function $t(e, t) {
          return function (n, a) {
            return n[e] === a[e] ? n[t] - a[t] : n[e] - a[e];
          };
        }
        C._set('global', {
          elements: {},
          events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
          hover: { onHover: null, mode: 'nearest', intersect: !0, animationDuration: 400 },
          onClick: null,
          maintainAspectRatio: !0,
          responsive: !0,
          responsiveAnimationDuration: 0,
        });
        var Kt = function (e, t) {
          return this.construct(e, t), this;
        };
        R.extend(Kt.prototype, {
          construct: function (e, t) {
            var n = this;
            t = (function (e) {
              var t = ((e = e || Object.create(null)).data = e.data || {});
              return (
                (t.datasets = t.datasets || []),
                (t.labels = t.labels || []),
                (e.options = Jt(C.global, C[e.type], e.options || {})),
                e
              );
            })(t);
            var a = St.acquireContext(e, t),
              r = a && a.canvas,
              i = r && r.height,
              s = r && r.width;
            (n.id = R.uid()),
              (n.ctx = a),
              (n.canvas = r),
              (n.config = t),
              (n.width = s),
              (n.height = i),
              (n.aspectRatio = i ? s / i : null),
              (n.options = t.options),
              (n._bufferedRender = !1),
              (n._layers = []),
              (n.chart = n),
              (n.controller = n),
              (Kt.instances[n.id] = n),
              Object.defineProperty(n, 'data', {
                get: function () {
                  return n.config.data;
                },
                set: function (e) {
                  n.config.data = e;
                },
              }),
              a && r
                ? (n.initialize(), n.update())
                : console.error("Failed to create chart: can't acquire context from the given item");
          },
          initialize: function () {
            var e = this;
            return (
              Ht.notify(e, 'beforeInit'),
              R.retinaScale(e, e.options.devicePixelRatio),
              e.bindEvents(),
              e.options.responsive && e.resize(!0),
              e.initToolTip(),
              Ht.notify(e, 'afterInit'),
              e
            );
          },
          clear: function () {
            return R.canvas.clear(this), this;
          },
          stop: function () {
            return X.cancelAnimation(this), this;
          },
          resize: function (e) {
            var t = this,
              n = t.options,
              a = t.canvas,
              r = (n.maintainAspectRatio && t.aspectRatio) || null,
              i = Math.max(0, Math.floor(R.getMaximumWidth(a))),
              s = Math.max(0, Math.floor(r ? i / r : R.getMaximumHeight(a)));
            if (
              (t.width !== i || t.height !== s) &&
              ((a.width = t.width = i),
              (a.height = t.height = s),
              (a.style.width = i + 'px'),
              (a.style.height = s + 'px'),
              R.retinaScale(t, n.devicePixelRatio),
              !e)
            ) {
              var o = { width: i, height: s };
              Ht.notify(t, 'resize', [o]),
                n.onResize && n.onResize(t, o),
                t.stop(),
                t.update({ duration: n.responsiveAnimationDuration });
            }
          },
          ensureScalesHaveIDs: function () {
            var e = this.options,
              t = e.scales || {},
              n = e.scale;
            R.each(t.xAxes, function (e, n) {
              e.id || (e.id = Gt(t.xAxes, 'x-axis-', n));
            }),
              R.each(t.yAxes, function (e, n) {
                e.id || (e.id = Gt(t.yAxes, 'y-axis-', n));
              }),
              n && (n.id = n.id || 'scale');
          },
          buildOrUpdateScales: function () {
            var e = this,
              t = e.options,
              n = e.scales || {},
              a = [],
              r = Object.keys(n).reduce(function (e, t) {
                return (e[t] = !1), e;
              }, {});
            t.scales &&
              (a = a.concat(
                (t.scales.xAxes || []).map(function (e) {
                  return { options: e, dtype: 'category', dposition: 'bottom' };
                }),
                (t.scales.yAxes || []).map(function (e) {
                  return { options: e, dtype: 'linear', dposition: 'left' };
                }),
              )),
              t.scale && a.push({ options: t.scale, dtype: 'radialLinear', isDefault: !0, dposition: 'chartArea' }),
              R.each(a, function (t) {
                var a = t.options,
                  i = a.id,
                  s = Vt(a.type, t.dtype);
                qt(a.position) !== qt(t.dposition) && (a.position = t.dposition), (r[i] = !0);
                var o = null;
                if (i in n && n[i].type === s) ((o = n[i]).options = a), (o.ctx = e.ctx), (o.chart = e);
                else {
                  var d = jt.getScaleConstructor(s);
                  if (!d) return;
                  (o = new d({ id: i, type: s, options: a, ctx: e.ctx, chart: e })), (n[o.id] = o);
                }
                o.mergeTicksOptions(), t.isDefault && (e.scale = o);
              }),
              R.each(r, function (e, t) {
                e || delete n[t];
              }),
              (e.scales = n),
              jt.addScalesToLayout(this);
          },
          buildOrUpdateControllers: function () {
            var e,
              t,
              n = this,
              a = [],
              r = n.data.datasets;
            for (e = 0, t = r.length; e < t; e++) {
              var i = r[e],
                s = n.getDatasetMeta(e),
                o = i.type || n.config.type;
              if (
                (s.type && s.type !== o && (n.destroyDatasetMeta(e), (s = n.getDatasetMeta(e))),
                (s.type = o),
                (s.order = i.order || 0),
                (s.index = e),
                s.controller)
              )
                s.controller.updateIndex(e), s.controller.linkScales();
              else {
                var d = Xe[s.type];
                if (void 0 === d) throw new Error('"' + s.type + '" is not a chart type.');
                (s.controller = new d(n, e)), a.push(s.controller);
              }
            }
            return a;
          },
          resetElements: function () {
            var e = this;
            R.each(
              e.data.datasets,
              function (t, n) {
                e.getDatasetMeta(n).controller.reset();
              },
              e,
            );
          },
          reset: function () {
            this.resetElements(), this.tooltip.initialize();
          },
          update: function (e) {
            var t,
              n,
              a = this;
            if (
              ((e && 'object' == typeof e) || (e = { duration: e, lazy: arguments[1] }),
              Ut(a),
              Ht._invalidate(a),
              !1 !== Ht.notify(a, 'beforeUpdate'))
            ) {
              a.tooltip._data = a.data;
              var r = a.buildOrUpdateControllers();
              for (t = 0, n = a.data.datasets.length; t < n; t++)
                a.getDatasetMeta(t).controller.buildOrUpdateElements();
              a.updateLayout(),
                a.options.animation &&
                  a.options.animation.duration &&
                  R.each(r, function (e) {
                    e.reset();
                  }),
                a.updateDatasets(),
                a.tooltip.initialize(),
                (a.lastActive = []),
                Ht.notify(a, 'afterUpdate'),
                a._layers.sort($t('z', '_idx')),
                a._bufferedRender
                  ? (a._bufferedRequest = { duration: e.duration, easing: e.easing, lazy: e.lazy })
                  : a.render(e);
            }
          },
          updateLayout: function () {
            var e = this;
            !1 !== Ht.notify(e, 'beforeLayout') &&
              (ft.update(this, this.width, this.height),
              (e._layers = []),
              R.each(
                e.boxes,
                function (t) {
                  t._configure && t._configure(), e._layers.push.apply(e._layers, t._layers());
                },
                e,
              ),
              e._layers.forEach(function (e, t) {
                e._idx = t;
              }),
              Ht.notify(e, 'afterScaleUpdate'),
              Ht.notify(e, 'afterLayout'));
          },
          updateDatasets: function () {
            if (!1 !== Ht.notify(this, 'beforeDatasetsUpdate')) {
              for (var e = 0, t = this.data.datasets.length; e < t; ++e) this.updateDataset(e);
              Ht.notify(this, 'afterDatasetsUpdate');
            }
          },
          updateDataset: function (e) {
            var t = this.getDatasetMeta(e),
              n = { meta: t, index: e };
            !1 !== Ht.notify(this, 'beforeDatasetUpdate', [n]) &&
              (t.controller._update(), Ht.notify(this, 'afterDatasetUpdate', [n]));
          },
          render: function (e) {
            var t = this;
            (e && 'object' == typeof e) || (e = { duration: e, lazy: arguments[1] });
            var n = t.options.animation,
              a = Vt(e.duration, n && n.duration),
              r = e.lazy;
            if (!1 !== Ht.notify(t, 'beforeRender')) {
              var i = function (e) {
                Ht.notify(t, 'afterRender'), R.callback(n && n.onComplete, [e], t);
              };
              if (n && a) {
                var s = new Z({
                  numSteps: a / 16.66,
                  easing: e.easing || n.easing,
                  render: function (e, t) {
                    var n = R.easing.effects[t.easing],
                      a = t.currentStep,
                      r = a / t.numSteps;
                    e.draw(n(r), r, a);
                  },
                  onAnimationProgress: n.onProgress,
                  onAnimationComplete: i,
                });
                X.addAnimation(t, s, a, r);
              } else t.draw(), i(new Z({ numSteps: 0, chart: t }));
              return t;
            }
          },
          draw: function (e) {
            var t,
              n,
              a = this;
            if (
              (a.clear(),
              R.isNullOrUndef(e) && (e = 1),
              a.transition(e),
              !(a.width <= 0 || a.height <= 0) && !1 !== Ht.notify(a, 'beforeDraw', [e]))
            ) {
              for (n = a._layers, t = 0; t < n.length && n[t].z <= 0; ++t) n[t].draw(a.chartArea);
              for (a.drawDatasets(e); t < n.length; ++t) n[t].draw(a.chartArea);
              a._drawTooltip(e), Ht.notify(a, 'afterDraw', [e]);
            }
          },
          transition: function (e) {
            for (var t = 0, n = (this.data.datasets || []).length; t < n; ++t)
              this.isDatasetVisible(t) && this.getDatasetMeta(t).controller.transition(e);
            this.tooltip.transition(e);
          },
          _getSortedDatasetMetas: function (e) {
            var t,
              n,
              a = [];
            for (t = 0, n = (this.data.datasets || []).length; t < n; ++t)
              (e && !this.isDatasetVisible(t)) || a.push(this.getDatasetMeta(t));
            return a.sort($t('order', 'index')), a;
          },
          _getSortedVisibleDatasetMetas: function () {
            return this._getSortedDatasetMetas(!0);
          },
          drawDatasets: function (e) {
            var t, n;
            if (!1 !== Ht.notify(this, 'beforeDatasetsDraw', [e])) {
              for (n = (t = this._getSortedVisibleDatasetMetas()).length - 1; n >= 0; --n) this.drawDataset(t[n], e);
              Ht.notify(this, 'afterDatasetsDraw', [e]);
            }
          },
          drawDataset: function (e, t) {
            var n = { meta: e, index: e.index, easingValue: t };
            !1 !== Ht.notify(this, 'beforeDatasetDraw', [n]) &&
              (e.controller.draw(t), Ht.notify(this, 'afterDatasetDraw', [n]));
          },
          _drawTooltip: function (e) {
            var t = this.tooltip,
              n = { tooltip: t, easingValue: e };
            !1 !== Ht.notify(this, 'beforeTooltipDraw', [n]) && (t.draw(), Ht.notify(this, 'afterTooltipDraw', [n]));
          },
          getElementAtEvent: function (e) {
            return it.modes.single(this, e);
          },
          getElementsAtEvent: function (e) {
            return it.modes.label(this, e, { intersect: !0 });
          },
          getElementsAtXAxis: function (e) {
            return it.modes['x-axis'](this, e, { intersect: !0 });
          },
          getElementsAtEventForMode: function (e, t, n) {
            var a = it.modes[t];
            return 'function' == typeof a ? a(this, e, n) : [];
          },
          getDatasetAtEvent: function (e) {
            return it.modes.dataset(this, e, { intersect: !0 });
          },
          getDatasetMeta: function (e) {
            var t = this.data.datasets[e];
            t._meta || (t._meta = {});
            var n = t._meta[this.id];
            return (
              n ||
                (n = t._meta[this.id] =
                  {
                    type: null,
                    data: [],
                    dataset: null,
                    controller: null,
                    hidden: null,
                    xAxisID: null,
                    yAxisID: null,
                    order: t.order || 0,
                    index: e,
                  }),
              n
            );
          },
          getVisibleDatasetCount: function () {
            for (var e = 0, t = 0, n = this.data.datasets.length; t < n; ++t) this.isDatasetVisible(t) && e++;
            return e;
          },
          isDatasetVisible: function (e) {
            var t = this.getDatasetMeta(e);
            return 'boolean' == typeof t.hidden ? !t.hidden : !this.data.datasets[e].hidden;
          },
          generateLegend: function () {
            return this.options.legendCallback(this);
          },
          destroyDatasetMeta: function (e) {
            var t = this.id,
              n = this.data.datasets[e],
              a = n._meta && n._meta[t];
            a && (a.controller.destroy(), delete n._meta[t]);
          },
          destroy: function () {
            var e,
              t,
              n = this,
              a = n.canvas;
            for (n.stop(), e = 0, t = n.data.datasets.length; e < t; ++e) n.destroyDatasetMeta(e);
            a && (n.unbindEvents(), R.canvas.clear(n), St.releaseContext(n.ctx), (n.canvas = null), (n.ctx = null)),
              Ht.notify(n, 'destroy'),
              delete Kt.instances[n.id];
          },
          toBase64Image: function () {
            return this.canvas.toDataURL.apply(this.canvas, arguments);
          },
          initToolTip: function () {
            var e = this;
            e.tooltip = new Rt({ _chart: e, _chartInstance: e, _data: e.data, _options: e.options.tooltips }, e);
          },
          bindEvents: function () {
            var e = this,
              t = (e._listeners = {}),
              n = function () {
                e.eventHandler.apply(e, arguments);
              };
            R.each(e.options.events, function (a) {
              St.addEventListener(e, a, n), (t[a] = n);
            }),
              e.options.responsive &&
                ((n = function () {
                  e.resize();
                }),
                St.addEventListener(e, 'resize', n),
                (t.resize = n));
          },
          unbindEvents: function () {
            var e = this,
              t = e._listeners;
            t &&
              (delete e._listeners,
              R.each(t, function (t, n) {
                St.removeEventListener(e, n, t);
              }));
          },
          updateHoverStyle: function (e, t, n) {
            var a,
              r,
              i,
              s = n ? 'set' : 'remove';
            for (r = 0, i = e.length; r < i; ++r)
              (a = e[r]) && this.getDatasetMeta(a._datasetIndex).controller[s + 'HoverStyle'](a);
            'dataset' === t && this.getDatasetMeta(e[0]._datasetIndex).controller['_' + s + 'DatasetHoverStyle']();
          },
          eventHandler: function (e) {
            var t = this,
              n = t.tooltip;
            if (!1 !== Ht.notify(t, 'beforeEvent', [e])) {
              (t._bufferedRender = !0), (t._bufferedRequest = null);
              var a = t.handleEvent(e);
              n && (a = n._start ? n.handleEvent(e) : a | n.handleEvent(e)), Ht.notify(t, 'afterEvent', [e]);
              var r = t._bufferedRequest;
              return (
                r
                  ? t.render(r)
                  : a &&
                    !t.animating &&
                    (t.stop(), t.render({ duration: t.options.hover.animationDuration, lazy: !0 })),
                (t._bufferedRender = !1),
                (t._bufferedRequest = null),
                t
              );
            }
          },
          handleEvent: function (e) {
            var t,
              n = this,
              a = n.options || {},
              r = a.hover;
            return (
              (n.lastActive = n.lastActive || []),
              'mouseout' === e.type ? (n.active = []) : (n.active = n.getElementsAtEventForMode(e, r.mode, r)),
              R.callback(a.onHover || a.hover.onHover, [e.native, n.active], n),
              ('mouseup' !== e.type && 'click' !== e.type) || (a.onClick && a.onClick.call(n, e.native, n.active)),
              n.lastActive.length && n.updateHoverStyle(n.lastActive, r.mode, !1),
              n.active.length && r.mode && n.updateHoverStyle(n.active, r.mode, !0),
              (t = !R.arrayEquals(n.active, n.lastActive)),
              (n.lastActive = n.active),
              t
            );
          },
        }),
          (Kt.instances = {});
        var Zt = Kt;
        function Xt() {
          throw new Error(
            'This method is not implemented: either no adapter can be found or an incomplete integration was provided.',
          );
        }
        function Qt(e) {
          this.options = e || {};
        }
        (Kt.Controller = Kt),
          (Kt.types = {}),
          (R.configMerge = Jt),
          (R.scaleMerge = Bt),
          R.extend(Qt.prototype, {
            formats: Xt,
            parse: Xt,
            format: Xt,
            add: Xt,
            diff: Xt,
            startOf: Xt,
            endOf: Xt,
            _create: function (e) {
              return e;
            },
          }),
          (Qt.override = function (e) {
            R.extend(Qt.prototype, e);
          });
        var en = { _date: Qt },
          tn = {
            formatters: {
              values: function (e) {
                return R.isArray(e) ? e : '' + e;
              },
              linear: function (e, t, n) {
                var a = n.length > 3 ? n[2] - n[1] : n[1] - n[0];
                Math.abs(a) > 1 && e !== Math.floor(e) && (a = e - Math.floor(e));
                var r = R.log10(Math.abs(a)),
                  i = '';
                if (0 !== e)
                  if (Math.max(Math.abs(n[0]), Math.abs(n[n.length - 1])) < 1e-4) {
                    var s = R.log10(Math.abs(e)),
                      o = Math.floor(s) - Math.floor(r);
                    (o = Math.max(Math.min(o, 20), 0)), (i = e.toExponential(o));
                  } else {
                    var d = -1 * Math.floor(r);
                    (d = Math.max(Math.min(d, 20), 0)), (i = e.toFixed(d));
                  }
                else i = '0';
                return i;
              },
              logarithmic: function (e, t, n) {
                var a = e / Math.pow(10, Math.floor(R.log10(e)));
                return 0 === e
                  ? '0'
                  : 1 === a || 2 === a || 5 === a || 0 === t || t === n.length - 1
                  ? e.toExponential()
                  : '';
              },
            },
          },
          nn = R.isArray,
          an = R.isNullOrUndef,
          rn = R.valueOrDefault,
          sn = R.valueAtIndexOrDefault;
        function on(e, t, n) {
          var a,
            r = e.getTicks().length,
            i = Math.min(t, r - 1),
            s = e.getPixelForTick(i),
            o = e._startPixel,
            d = e._endPixel;
          if (
            !(
              n &&
              ((a =
                1 === r
                  ? Math.max(s - o, d - s)
                  : 0 === t
                  ? (e.getPixelForTick(1) - s) / 2
                  : (s - e.getPixelForTick(i - 1)) / 2),
              (s += i < t ? a : -a) < o - 1e-6 || s > d + 1e-6)
            )
          )
            return s;
        }
        function dn(e, t, n, a) {
          var r,
            i,
            s,
            o,
            d,
            l,
            u,
            _,
            c,
            h,
            m,
            f,
            p,
            M = n.length,
            y = [],
            g = [],
            L = [],
            v = 0,
            Y = 0;
          for (r = 0; r < M; ++r) {
            if (
              ((o = n[r].label),
              (d = n[r].major ? t.major : t.minor),
              (e.font = l = d.string),
              (u = a[l] = a[l] || { data: {}, gc: [] }),
              (_ = d.lineHeight),
              (c = h = 0),
              an(o) || nn(o))
            ) {
              if (nn(o))
                for (i = 0, s = o.length; i < s; ++i)
                  (m = o[i]), an(m) || nn(m) || ((c = R.measureText(e, u.data, u.gc, c, m)), (h += _));
            } else (c = R.measureText(e, u.data, u.gc, c, o)), (h = _);
            y.push(c), g.push(h), L.push(_ / 2), (v = Math.max(c, v)), (Y = Math.max(h, Y));
          }
          function b(e) {
            return { width: y[e] || 0, height: g[e] || 0, offset: L[e] || 0 };
          }
          return (
            (function (e, t) {
              R.each(e, function (e) {
                var n,
                  a = e.gc,
                  r = a.length / 2;
                if (r > t) {
                  for (n = 0; n < r; ++n) delete e.data[a[n]];
                  a.splice(0, r);
                }
              });
            })(a, M),
            (f = y.indexOf(v)),
            (p = g.indexOf(Y)),
            { first: b(0), last: b(M - 1), widest: b(f), highest: b(p) }
          );
        }
        function ln(e) {
          return e.drawTicks ? e.tickMarkLength : 0;
        }
        function un(e) {
          var t, n;
          return e.display
            ? ((t = R.options._parseFont(e)), (n = R.options.toPadding(e.padding)), t.lineHeight + n.height)
            : 0;
        }
        function _n(e, t) {
          return R.extend(
            R.options._parseFont({
              fontFamily: rn(t.fontFamily, e.fontFamily),
              fontSize: rn(t.fontSize, e.fontSize),
              fontStyle: rn(t.fontStyle, e.fontStyle),
              lineHeight: rn(t.lineHeight, e.lineHeight),
            }),
            { color: R.options.resolve([t.fontColor, e.fontColor, C.global.defaultFontColor]) },
          );
        }
        function cn(e) {
          var t = _n(e, e.minor);
          return { minor: t, major: e.major.enabled ? _n(e, e.major) : t };
        }
        function hn(e) {
          var t,
            n,
            a,
            r = [];
          for (n = 0, a = e.length; n < a; ++n) void 0 !== (t = e[n])._index && r.push(t);
          return r;
        }
        function mn(e, t, n, a) {
          var r,
            i,
            s,
            o,
            d = rn(n, 0),
            l = Math.min(rn(a, e.length), e.length),
            u = 0;
          for (t = Math.ceil(t), a && (t = (r = a - n) / Math.floor(r / t)), o = d; o < 0; )
            u++, (o = Math.round(d + u * t));
          for (i = Math.max(d, 0); i < l; i++)
            (s = e[i]), i === o ? ((s._index = i), u++, (o = Math.round(d + u * t))) : delete s.label;
        }
        C._set('scale', {
          display: !0,
          position: 'left',
          offset: !1,
          gridLines: {
            display: !0,
            color: 'rgba(0,0,0,0.1)',
            lineWidth: 1,
            drawBorder: !0,
            drawOnChartArea: !0,
            drawTicks: !0,
            tickMarkLength: 10,
            zeroLineWidth: 1,
            zeroLineColor: 'rgba(0,0,0,0.25)',
            zeroLineBorderDash: [],
            zeroLineBorderDashOffset: 0,
            offsetGridLines: !1,
            borderDash: [],
            borderDashOffset: 0,
          },
          scaleLabel: { display: !1, labelString: '', padding: { top: 4, bottom: 4 } },
          ticks: {
            beginAtZero: !1,
            minRotation: 0,
            maxRotation: 50,
            mirror: !1,
            padding: 0,
            reverse: !1,
            display: !0,
            autoSkip: !0,
            autoSkipPadding: 0,
            labelOffset: 0,
            callback: tn.formatters.values,
            minor: {},
            major: {},
          },
        });
        var fn = $.extend({
          zeroLineIndex: 0,
          getPadding: function () {
            return {
              left: this.paddingLeft || 0,
              top: this.paddingTop || 0,
              right: this.paddingRight || 0,
              bottom: this.paddingBottom || 0,
            };
          },
          getTicks: function () {
            return this._ticks;
          },
          _getLabels: function () {
            var e = this.chart.data;
            return this.options.labels || (this.isHorizontal() ? e.xLabels : e.yLabels) || e.labels || [];
          },
          mergeTicksOptions: function () {},
          beforeUpdate: function () {
            R.callback(this.options.beforeUpdate, [this]);
          },
          update: function (e, t, n) {
            var a,
              r,
              i,
              s,
              o,
              d = this,
              l = d.options.ticks,
              u = l.sampleSize;
            if (
              (d.beforeUpdate(),
              (d.maxWidth = e),
              (d.maxHeight = t),
              (d.margins = R.extend({ left: 0, right: 0, top: 0, bottom: 0 }, n)),
              (d._ticks = null),
              (d.ticks = null),
              (d._labelSizes = null),
              (d._maxLabelLines = 0),
              (d.longestLabelWidth = 0),
              (d.longestTextCache = d.longestTextCache || {}),
              (d._gridLineItems = null),
              (d._labelItems = null),
              d.beforeSetDimensions(),
              d.setDimensions(),
              d.afterSetDimensions(),
              d.beforeDataLimits(),
              d.determineDataLimits(),
              d.afterDataLimits(),
              d.beforeBuildTicks(),
              (s = d.buildTicks() || []),
              (!(s = d.afterBuildTicks(s) || s) || !s.length) && d.ticks)
            )
              for (s = [], a = 0, r = d.ticks.length; a < r; ++a) s.push({ value: d.ticks[a], major: !1 });
            return (
              (d._ticks = s),
              (o = u < s.length),
              (i = d._convertTicksToLabels(
                o
                  ? (function (e, t) {
                      for (var n = [], a = e.length / t, r = 0, i = e.length; r < i; r += a) n.push(e[Math.floor(r)]);
                      return n;
                    })(s, u)
                  : s,
              )),
              d._configure(),
              d.beforeCalculateTickRotation(),
              d.calculateTickRotation(),
              d.afterCalculateTickRotation(),
              d.beforeFit(),
              d.fit(),
              d.afterFit(),
              (d._ticksToDraw = l.display && (l.autoSkip || 'auto' === l.source) ? d._autoSkip(s) : s),
              o && (i = d._convertTicksToLabels(d._ticksToDraw)),
              (d.ticks = i),
              d.afterUpdate(),
              d.minSize
            );
          },
          _configure: function () {
            var e,
              t,
              n = this,
              a = n.options.ticks.reverse;
            n.isHorizontal() ? ((e = n.left), (t = n.right)) : ((e = n.top), (t = n.bottom), (a = !a)),
              (n._startPixel = e),
              (n._endPixel = t),
              (n._reversePixels = a),
              (n._length = t - e);
          },
          afterUpdate: function () {
            R.callback(this.options.afterUpdate, [this]);
          },
          beforeSetDimensions: function () {
            R.callback(this.options.beforeSetDimensions, [this]);
          },
          setDimensions: function () {
            var e = this;
            e.isHorizontal()
              ? ((e.width = e.maxWidth), (e.left = 0), (e.right = e.width))
              : ((e.height = e.maxHeight), (e.top = 0), (e.bottom = e.height)),
              (e.paddingLeft = 0),
              (e.paddingTop = 0),
              (e.paddingRight = 0),
              (e.paddingBottom = 0);
          },
          afterSetDimensions: function () {
            R.callback(this.options.afterSetDimensions, [this]);
          },
          beforeDataLimits: function () {
            R.callback(this.options.beforeDataLimits, [this]);
          },
          determineDataLimits: R.noop,
          afterDataLimits: function () {
            R.callback(this.options.afterDataLimits, [this]);
          },
          beforeBuildTicks: function () {
            R.callback(this.options.beforeBuildTicks, [this]);
          },
          buildTicks: R.noop,
          afterBuildTicks: function (e) {
            var t = this;
            return nn(e) && e.length
              ? R.callback(t.options.afterBuildTicks, [t, e])
              : ((t.ticks = R.callback(t.options.afterBuildTicks, [t, t.ticks]) || t.ticks), e);
          },
          beforeTickToLabelConversion: function () {
            R.callback(this.options.beforeTickToLabelConversion, [this]);
          },
          convertTicksToLabels: function () {
            var e = this.options.ticks;
            this.ticks = this.ticks.map(e.userCallback || e.callback, this);
          },
          afterTickToLabelConversion: function () {
            R.callback(this.options.afterTickToLabelConversion, [this]);
          },
          beforeCalculateTickRotation: function () {
            R.callback(this.options.beforeCalculateTickRotation, [this]);
          },
          calculateTickRotation: function () {
            var e,
              t,
              n,
              a,
              r,
              i,
              s,
              o = this,
              d = o.options,
              l = d.ticks,
              u = o.getTicks().length,
              _ = l.minRotation || 0,
              c = l.maxRotation,
              h = _;
            !o._isVisible() || !l.display || _ >= c || u <= 1 || !o.isHorizontal()
              ? (o.labelRotation = _)
              : ((t = (e = o._getLabelSizes()).widest.width),
                (n = e.highest.height - e.highest.offset),
                (a = Math.min(o.maxWidth, o.chart.width - t)),
                t + 6 > (r = d.offset ? o.maxWidth / u : a / (u - 1)) &&
                  ((r = a / (u - (d.offset ? 0.5 : 1))),
                  (i = o.maxHeight - ln(d.gridLines) - l.padding - un(d.scaleLabel)),
                  (s = Math.sqrt(t * t + n * n)),
                  (h = R.toDegrees(
                    Math.min(
                      Math.asin(Math.min((e.highest.height + 6) / r, 1)),
                      Math.asin(Math.min(i / s, 1)) - Math.asin(n / s),
                    ),
                  )),
                  (h = Math.max(_, Math.min(c, h)))),
                (o.labelRotation = h));
          },
          afterCalculateTickRotation: function () {
            R.callback(this.options.afterCalculateTickRotation, [this]);
          },
          beforeFit: function () {
            R.callback(this.options.beforeFit, [this]);
          },
          fit: function () {
            var e = this,
              t = (e.minSize = { width: 0, height: 0 }),
              n = e.chart,
              a = e.options,
              r = a.ticks,
              i = a.scaleLabel,
              s = a.gridLines,
              o = e._isVisible(),
              d = 'bottom' === a.position,
              l = e.isHorizontal();
            if (
              (l ? (t.width = e.maxWidth) : o && (t.width = ln(s) + un(i)),
              l ? o && (t.height = ln(s) + un(i)) : (t.height = e.maxHeight),
              r.display && o)
            ) {
              var u = cn(r),
                _ = e._getLabelSizes(),
                c = _.first,
                h = _.last,
                m = _.widest,
                f = _.highest,
                p = 0.4 * u.minor.lineHeight,
                M = r.padding;
              if (l) {
                var y = 0 !== e.labelRotation,
                  g = R.toRadians(e.labelRotation),
                  L = Math.cos(g),
                  v = Math.sin(g),
                  Y = v * m.width + L * (f.height - (y ? f.offset : 0)) + (y ? 0 : p);
                t.height = Math.min(e.maxHeight, t.height + Y + M);
                var b,
                  k,
                  D = e.getPixelForTick(0) - e.left,
                  w = e.right - e.getPixelForTick(e.getTicks().length - 1);
                y
                  ? ((b = d ? L * c.width + v * c.offset : v * (c.height - c.offset)),
                    (k = d ? v * (h.height - h.offset) : L * h.width + v * h.offset))
                  : ((b = c.width / 2), (k = h.width / 2)),
                  (e.paddingLeft = Math.max(((b - D) * e.width) / (e.width - D), 0) + 3),
                  (e.paddingRight = Math.max(((k - w) * e.width) / (e.width - w), 0) + 3);
              } else {
                var x = r.mirror ? 0 : m.width + M + p;
                (t.width = Math.min(e.maxWidth, t.width + x)),
                  (e.paddingTop = c.height / 2),
                  (e.paddingBottom = h.height / 2);
              }
            }
            e.handleMargins(),
              l
                ? ((e.width = e._length = n.width - e.margins.left - e.margins.right), (e.height = t.height))
                : ((e.width = t.width), (e.height = e._length = n.height - e.margins.top - e.margins.bottom));
          },
          handleMargins: function () {
            var e = this;
            e.margins &&
              ((e.margins.left = Math.max(e.paddingLeft, e.margins.left)),
              (e.margins.top = Math.max(e.paddingTop, e.margins.top)),
              (e.margins.right = Math.max(e.paddingRight, e.margins.right)),
              (e.margins.bottom = Math.max(e.paddingBottom, e.margins.bottom)));
          },
          afterFit: function () {
            R.callback(this.options.afterFit, [this]);
          },
          isHorizontal: function () {
            var e = this.options.position;
            return 'top' === e || 'bottom' === e;
          },
          isFullWidth: function () {
            return this.options.fullWidth;
          },
          getRightValue: function (e) {
            if (an(e)) return NaN;
            if (('number' == typeof e || e instanceof Number) && !isFinite(e)) return NaN;
            if (e)
              if (this.isHorizontal()) {
                if (void 0 !== e.x) return this.getRightValue(e.x);
              } else if (void 0 !== e.y) return this.getRightValue(e.y);
            return e;
          },
          _convertTicksToLabels: function (e) {
            var t,
              n,
              a,
              r = this;
            for (
              r.ticks = e.map(function (e) {
                return e.value;
              }),
                r.beforeTickToLabelConversion(),
                t = r.convertTicksToLabels(e) || r.ticks,
                r.afterTickToLabelConversion(),
                n = 0,
                a = e.length;
              n < a;
              ++n
            )
              e[n].label = t[n];
            return t;
          },
          _getLabelSizes: function () {
            var e = this,
              t = e._labelSizes;
            return (
              t ||
                ((e._labelSizes = t = dn(e.ctx, cn(e.options.ticks), e.getTicks(), e.longestTextCache)),
                (e.longestLabelWidth = t.widest.width)),
              t
            );
          },
          _parseValue: function (e) {
            var t, n, a, r;
            return (
              nn(e)
                ? ((t = +this.getRightValue(e[0])),
                  (n = +this.getRightValue(e[1])),
                  (a = Math.min(t, n)),
                  (r = Math.max(t, n)))
                : ((t = void 0), (n = e = +this.getRightValue(e)), (a = e), (r = e)),
              { min: a, max: r, start: t, end: n }
            );
          },
          _getScaleLabel: function (e) {
            var t = this._parseValue(e);
            return void 0 !== t.start ? '[' + t.start + ', ' + t.end + ']' : +this.getRightValue(e);
          },
          getLabelForIndex: R.noop,
          getPixelForValue: R.noop,
          getValueForPixel: R.noop,
          getPixelForTick: function (e) {
            var t = this.options.offset,
              n = this._ticks.length,
              a = 1 / Math.max(n - (t ? 0 : 1), 1);
            return e < 0 || e > n - 1 ? null : this.getPixelForDecimal(e * a + (t ? a / 2 : 0));
          },
          getPixelForDecimal: function (e) {
            return this._reversePixels && (e = 1 - e), this._startPixel + e * this._length;
          },
          getDecimalForPixel: function (e) {
            var t = (e - this._startPixel) / this._length;
            return this._reversePixels ? 1 - t : t;
          },
          getBasePixel: function () {
            return this.getPixelForValue(this.getBaseValue());
          },
          getBaseValue: function () {
            var e = this.min,
              t = this.max;
            return this.beginAtZero ? 0 : e < 0 && t < 0 ? t : e > 0 && t > 0 ? e : 0;
          },
          _autoSkip: function (e) {
            var t,
              n,
              a,
              r,
              i = this.options.ticks,
              s = this._length,
              o = i.maxTicksLimit || s / this._tickSize() + 1,
              d = i.major.enabled
                ? (function (e) {
                    var t,
                      n,
                      a = [];
                    for (t = 0, n = e.length; t < n; t++) e[t].major && a.push(t);
                    return a;
                  })(e)
                : [],
              l = d.length,
              u = d[0],
              _ = d[l - 1];
            if (l > o)
              return (
                (function (e, t, n) {
                  var a,
                    r,
                    i = 0,
                    s = t[0];
                  for (n = Math.ceil(n), a = 0; a < e.length; a++)
                    (r = e[a]), a === s ? ((r._index = a), (s = t[++i * n])) : delete r.label;
                })(e, d, l / o),
                hn(e)
              );
            if (
              ((a = (function (e, t, n, a) {
                var r,
                  i,
                  s,
                  o,
                  d = (function (e) {
                    var t,
                      n,
                      a = e.length;
                    if (a < 2) return !1;
                    for (n = e[0], t = 1; t < a; ++t) if (e[t] - e[t - 1] !== n) return !1;
                    return n;
                  })(e),
                  l = (t.length - 1) / a;
                if (!d) return Math.max(l, 1);
                for (s = 0, o = (r = R.math._factorize(d)).length - 1; s < o; s++) if ((i = r[s]) > l) return i;
                return Math.max(l, 1);
              })(d, e, 0, o)),
              l > 0)
            ) {
              for (t = 0, n = l - 1; t < n; t++) mn(e, a, d[t], d[t + 1]);
              return (
                (r = l > 1 ? (_ - u) / (l - 1) : null),
                mn(e, a, R.isNullOrUndef(r) ? 0 : u - r, u),
                mn(e, a, _, R.isNullOrUndef(r) ? e.length : _ + r),
                hn(e)
              );
            }
            return mn(e, a), hn(e);
          },
          _tickSize: function () {
            var e = this.options.ticks,
              t = R.toRadians(this.labelRotation),
              n = Math.abs(Math.cos(t)),
              a = Math.abs(Math.sin(t)),
              r = this._getLabelSizes(),
              i = e.autoSkipPadding || 0,
              s = r ? r.widest.width + i : 0,
              o = r ? r.highest.height + i : 0;
            return this.isHorizontal() ? (o * n > s * a ? s / n : o / a) : o * a < s * n ? o / n : s / a;
          },
          _isVisible: function () {
            var e,
              t,
              n,
              a = this.chart,
              r = this.options.display;
            if ('auto' !== r) return !!r;
            for (e = 0, t = a.data.datasets.length; e < t; ++e)
              if (a.isDatasetVisible(e) && ((n = a.getDatasetMeta(e)).xAxisID === this.id || n.yAxisID === this.id))
                return !0;
            return !1;
          },
          _computeGridLineItems: function (e) {
            var t,
              n,
              a,
              r,
              i,
              s,
              o,
              d,
              l,
              u,
              _,
              c,
              h,
              m,
              f,
              p,
              M,
              y = this,
              g = y.chart,
              L = y.options,
              v = L.gridLines,
              Y = L.position,
              b = v.offsetGridLines,
              k = y.isHorizontal(),
              D = y._ticksToDraw,
              w = D.length + (b ? 1 : 0),
              x = ln(v),
              T = [],
              S = v.drawBorder ? sn(v.lineWidth, 0, 0) : 0,
              H = S / 2,
              j = R._alignPixel,
              P = function (e) {
                return j(g, e, S);
              };
            for (
              'top' === Y
                ? ((t = P(y.bottom)), (o = y.bottom - x), (l = t - H), (_ = P(e.top) + H), (h = e.bottom))
                : 'bottom' === Y
                ? ((t = P(y.top)), (_ = e.top), (h = P(e.bottom) - H), (o = t + H), (l = y.top + x))
                : 'left' === Y
                ? ((t = P(y.right)), (s = y.right - x), (d = t - H), (u = P(e.left) + H), (c = e.right))
                : ((t = P(y.left)), (u = e.left), (c = P(e.right) - H), (s = t + H), (d = y.left + x)),
                n = 0;
              n < w;
              ++n
            )
              (a = D[n] || {}),
                (an(a.label) && n < D.length) ||
                  (n === y.zeroLineIndex && L.offset === b
                    ? ((m = v.zeroLineWidth),
                      (f = v.zeroLineColor),
                      (p = v.zeroLineBorderDash || []),
                      (M = v.zeroLineBorderDashOffset || 0))
                    : ((m = sn(v.lineWidth, n, 1)),
                      (f = sn(v.color, n, 'rgba(0,0,0,0.1)')),
                      (p = v.borderDash || []),
                      (M = v.borderDashOffset || 0)),
                  void 0 !== (r = on(y, a._index || n, b)) &&
                    ((i = j(g, r, m)),
                    k ? (s = d = u = c = i) : (o = l = _ = h = i),
                    T.push({
                      tx1: s,
                      ty1: o,
                      tx2: d,
                      ty2: l,
                      x1: u,
                      y1: _,
                      x2: c,
                      y2: h,
                      width: m,
                      color: f,
                      borderDash: p,
                      borderDashOffset: M,
                    })));
            return (T.ticksLength = w), (T.borderValue = t), T;
          },
          _computeLabelItems: function () {
            var e,
              t,
              n,
              a,
              r,
              i,
              s,
              o,
              d,
              l,
              u,
              _,
              c = this,
              h = c.options,
              m = h.ticks,
              f = h.position,
              p = m.mirror,
              M = c.isHorizontal(),
              y = c._ticksToDraw,
              g = cn(m),
              L = m.padding,
              v = ln(h.gridLines),
              Y = -R.toRadians(c.labelRotation),
              b = [];
            for (
              'top' === f
                ? ((i = c.bottom - v - L), (s = Y ? 'left' : 'center'))
                : 'bottom' === f
                ? ((i = c.top + v + L), (s = Y ? 'right' : 'center'))
                : 'left' === f
                ? ((r = c.right - (p ? 0 : v) - L), (s = p ? 'left' : 'right'))
                : ((r = c.left + (p ? 0 : v) + L), (s = p ? 'right' : 'left')),
                e = 0,
                t = y.length;
              e < t;
              ++e
            )
              (a = (n = y[e]).label),
                an(a) ||
                  ((o = c.getPixelForTick(n._index || e) + m.labelOffset),
                  (l = (d = n.major ? g.major : g.minor).lineHeight),
                  (u = nn(a) ? a.length : 1),
                  M
                    ? ((r = o), (_ = 'top' === f ? ((Y ? 1 : 0.5) - u) * l : (Y ? 0 : 0.5) * l))
                    : ((i = o), (_ = ((1 - u) * l) / 2)),
                  b.push({ x: r, y: i, rotation: Y, label: a, font: d, textOffset: _, textAlign: s }));
            return b;
          },
          _drawGrid: function (e) {
            var t = this,
              n = t.options.gridLines;
            if (n.display) {
              var a,
                r,
                i,
                s,
                o,
                d = t.ctx,
                l = t.chart,
                u = R._alignPixel,
                _ = n.drawBorder ? sn(n.lineWidth, 0, 0) : 0,
                c = t._gridLineItems || (t._gridLineItems = t._computeGridLineItems(e));
              for (i = 0, s = c.length; i < s; ++i)
                (a = (o = c[i]).width),
                  (r = o.color),
                  a &&
                    r &&
                    (d.save(),
                    (d.lineWidth = a),
                    (d.strokeStyle = r),
                    d.setLineDash && (d.setLineDash(o.borderDash), (d.lineDashOffset = o.borderDashOffset)),
                    d.beginPath(),
                    n.drawTicks && (d.moveTo(o.tx1, o.ty1), d.lineTo(o.tx2, o.ty2)),
                    n.drawOnChartArea && (d.moveTo(o.x1, o.y1), d.lineTo(o.x2, o.y2)),
                    d.stroke(),
                    d.restore());
              if (_) {
                var h,
                  m,
                  f,
                  p,
                  M = _,
                  y = sn(n.lineWidth, c.ticksLength - 1, 1),
                  g = c.borderValue;
                t.isHorizontal()
                  ? ((h = u(l, t.left, M) - M / 2), (m = u(l, t.right, y) + y / 2), (f = p = g))
                  : ((f = u(l, t.top, M) - M / 2), (p = u(l, t.bottom, y) + y / 2), (h = m = g)),
                  (d.lineWidth = _),
                  (d.strokeStyle = sn(n.color, 0)),
                  d.beginPath(),
                  d.moveTo(h, f),
                  d.lineTo(m, p),
                  d.stroke();
              }
            }
          },
          _drawLabels: function () {
            var e = this;
            if (e.options.ticks.display) {
              var t,
                n,
                a,
                r,
                i,
                s,
                o,
                d,
                l = e.ctx,
                u = e._labelItems || (e._labelItems = e._computeLabelItems());
              for (t = 0, a = u.length; t < a; ++t) {
                if (
                  ((s = (i = u[t]).font),
                  l.save(),
                  l.translate(i.x, i.y),
                  l.rotate(i.rotation),
                  (l.font = s.string),
                  (l.fillStyle = s.color),
                  (l.textBaseline = 'middle'),
                  (l.textAlign = i.textAlign),
                  (o = i.label),
                  (d = i.textOffset),
                  nn(o))
                )
                  for (n = 0, r = o.length; n < r; ++n) l.fillText('' + o[n], 0, d), (d += s.lineHeight);
                else l.fillText(o, 0, d);
                l.restore();
              }
            }
          },
          _drawTitle: function () {
            var e = this,
              t = e.ctx,
              n = e.options,
              a = n.scaleLabel;
            if (a.display) {
              var r,
                i,
                s = rn(a.fontColor, C.global.defaultFontColor),
                o = R.options._parseFont(a),
                d = R.options.toPadding(a.padding),
                l = o.lineHeight / 2,
                u = n.position,
                _ = 0;
              if (e.isHorizontal())
                (r = e.left + e.width / 2), (i = 'bottom' === u ? e.bottom - l - d.bottom : e.top + l + d.top);
              else {
                var c = 'left' === u;
                (r = c ? e.left + l + d.top : e.right - l - d.top),
                  (i = e.top + e.height / 2),
                  (_ = c ? -0.5 * Math.PI : 0.5 * Math.PI);
              }
              t.save(),
                t.translate(r, i),
                t.rotate(_),
                (t.textAlign = 'center'),
                (t.textBaseline = 'middle'),
                (t.fillStyle = s),
                (t.font = o.string),
                t.fillText(a.labelString, 0, 0),
                t.restore();
            }
          },
          draw: function (e) {
            this._isVisible() && (this._drawGrid(e), this._drawTitle(), this._drawLabels());
          },
          _layers: function () {
            var e = this,
              t = e.options,
              n = (t.ticks && t.ticks.z) || 0,
              a = (t.gridLines && t.gridLines.z) || 0;
            return e._isVisible() && n !== a && e.draw === e._draw
              ? [
                  {
                    z: a,
                    draw: function () {
                      e._drawGrid.apply(e, arguments), e._drawTitle.apply(e, arguments);
                    },
                  },
                  {
                    z: n,
                    draw: function () {
                      e._drawLabels.apply(e, arguments);
                    },
                  },
                ]
              : [
                  {
                    z: n,
                    draw: function () {
                      e.draw.apply(e, arguments);
                    },
                  },
                ];
          },
          _getMatchingVisibleMetas: function (e) {
            var t = this,
              n = t.isHorizontal();
            return t.chart._getSortedVisibleDatasetMetas().filter(function (a) {
              return (!e || a.type === e) && (n ? a.xAxisID === t.id : a.yAxisID === t.id);
            });
          },
        });
        fn.prototype._draw = fn.prototype.draw;
        var pn = fn,
          Mn = R.isNullOrUndef,
          yn = pn.extend({
            determineDataLimits: function () {
              var e,
                t = this,
                n = t._getLabels(),
                a = t.options.ticks,
                r = a.min,
                i = a.max,
                s = 0,
                o = n.length - 1;
              void 0 !== r && (e = n.indexOf(r)) >= 0 && (s = e),
                void 0 !== i && (e = n.indexOf(i)) >= 0 && (o = e),
                (t.minIndex = s),
                (t.maxIndex = o),
                (t.min = n[s]),
                (t.max = n[o]);
            },
            buildTicks: function () {
              var e = this._getLabels(),
                t = this.minIndex,
                n = this.maxIndex;
              this.ticks = 0 === t && n === e.length - 1 ? e : e.slice(t, n + 1);
            },
            getLabelForIndex: function (e, t) {
              var n = this.chart;
              return n.getDatasetMeta(t).controller._getValueScaleId() === this.id
                ? this.getRightValue(n.data.datasets[t].data[e])
                : this._getLabels()[e];
            },
            _configure: function () {
              var e = this,
                t = e.options.offset,
                n = e.ticks;
              pn.prototype._configure.call(e),
                e.isHorizontal() || (e._reversePixels = !e._reversePixels),
                n &&
                  ((e._startValue = e.minIndex - (t ? 0.5 : 0)), (e._valueRange = Math.max(n.length - (t ? 0 : 1), 1)));
            },
            getPixelForValue: function (e, t, n) {
              var a,
                r,
                i,
                s = this;
              return (
                Mn(t) || Mn(n) || (e = s.chart.data.datasets[n].data[t]),
                Mn(e) || (a = s.isHorizontal() ? e.x : e.y),
                (void 0 !== a || (void 0 !== e && isNaN(t))) &&
                  ((r = s._getLabels()),
                  (e = R.valueOrDefault(a, e)),
                  (t = -1 !== (i = r.indexOf(e)) ? i : t),
                  isNaN(t) && (t = e)),
                s.getPixelForDecimal((t - s._startValue) / s._valueRange)
              );
            },
            getPixelForTick: function (e) {
              var t = this.ticks;
              return e < 0 || e > t.length - 1 ? null : this.getPixelForValue(t[e], e + this.minIndex);
            },
            getValueForPixel: function (e) {
              var t = Math.round(this._startValue + this.getDecimalForPixel(e) * this._valueRange);
              return Math.min(Math.max(t, 0), this.ticks.length - 1);
            },
            getBasePixel: function () {
              return this.bottom;
            },
          }),
          gn = { position: 'bottom' };
        yn._defaults = gn;
        var Ln = R.noop,
          vn = R.isNullOrUndef,
          Yn = pn.extend({
            getRightValue: function (e) {
              return 'string' == typeof e ? +e : pn.prototype.getRightValue.call(this, e);
            },
            handleTickRangeOptions: function () {
              var e = this,
                t = e.options.ticks;
              if (t.beginAtZero) {
                var n = R.sign(e.min),
                  a = R.sign(e.max);
                n < 0 && a < 0 ? (e.max = 0) : n > 0 && a > 0 && (e.min = 0);
              }
              var r = void 0 !== t.min || void 0 !== t.suggestedMin,
                i = void 0 !== t.max || void 0 !== t.suggestedMax;
              void 0 !== t.min
                ? (e.min = t.min)
                : void 0 !== t.suggestedMin &&
                  (null === e.min ? (e.min = t.suggestedMin) : (e.min = Math.min(e.min, t.suggestedMin))),
                void 0 !== t.max
                  ? (e.max = t.max)
                  : void 0 !== t.suggestedMax &&
                    (null === e.max ? (e.max = t.suggestedMax) : (e.max = Math.max(e.max, t.suggestedMax))),
                r !== i && e.min >= e.max && (r ? (e.max = e.min + 1) : (e.min = e.max - 1)),
                e.min === e.max && (e.max++, t.beginAtZero || e.min--);
            },
            getTickLimit: function () {
              var e,
                t = this.options.ticks,
                n = t.stepSize,
                a = t.maxTicksLimit;
              return (
                n
                  ? (e = Math.ceil(this.max / n) - Math.floor(this.min / n) + 1)
                  : ((e = this._computeTickLimit()), (a = a || 11)),
                a && (e = Math.min(a, e)),
                e
              );
            },
            _computeTickLimit: function () {
              return Number.POSITIVE_INFINITY;
            },
            handleDirectionalChanges: Ln,
            buildTicks: function () {
              var e = this,
                t = e.options.ticks,
                n = e.getTickLimit(),
                a = {
                  maxTicks: (n = Math.max(2, n)),
                  min: t.min,
                  max: t.max,
                  precision: t.precision,
                  stepSize: R.valueOrDefault(t.fixedStepSize, t.stepSize),
                },
                r = (e.ticks = (function (e, t) {
                  var n,
                    a,
                    r,
                    i,
                    s = [],
                    o = e.stepSize,
                    d = o || 1,
                    l = e.maxTicks - 1,
                    u = e.min,
                    _ = e.max,
                    c = e.precision,
                    h = t.min,
                    m = t.max,
                    f = R.niceNum((m - h) / l / d) * d;
                  if (f < 1e-14 && vn(u) && vn(_)) return [h, m];
                  (i = Math.ceil(m / f) - Math.floor(h / f)) > l && (f = R.niceNum((i * f) / l / d) * d),
                    o || vn(c)
                      ? (n = Math.pow(10, R._decimalPlaces(f)))
                      : ((n = Math.pow(10, c)), (f = Math.ceil(f * n) / n)),
                    (a = Math.floor(h / f) * f),
                    (r = Math.ceil(m / f) * f),
                    o &&
                      (!vn(u) && R.almostWhole(u / f, f / 1e3) && (a = u),
                      !vn(_) && R.almostWhole(_ / f, f / 1e3) && (r = _)),
                    (i = (r - a) / f),
                    (i = R.almostEquals(i, Math.round(i), f / 1e3) ? Math.round(i) : Math.ceil(i)),
                    (a = Math.round(a * n) / n),
                    (r = Math.round(r * n) / n),
                    s.push(vn(u) ? a : u);
                  for (var p = 1; p < i; ++p) s.push(Math.round((a + p * f) * n) / n);
                  return s.push(vn(_) ? r : _), s;
                })(a, e));
              e.handleDirectionalChanges(),
                (e.max = R.max(r)),
                (e.min = R.min(r)),
                t.reverse ? (r.reverse(), (e.start = e.max), (e.end = e.min)) : ((e.start = e.min), (e.end = e.max));
            },
            convertTicksToLabels: function () {
              var e = this;
              (e.ticksAsNumbers = e.ticks.slice()),
                (e.zeroLineIndex = e.ticks.indexOf(0)),
                pn.prototype.convertTicksToLabels.call(e);
            },
            _configure: function () {
              var e,
                t = this,
                n = t.getTicks(),
                a = t.min,
                r = t.max;
              pn.prototype._configure.call(t),
                t.options.offset && n.length && ((a -= e = (r - a) / Math.max(n.length - 1, 1) / 2), (r += e)),
                (t._startValue = a),
                (t._endValue = r),
                (t._valueRange = r - a);
            },
          }),
          bn = { position: 'left', ticks: { callback: tn.formatters.linear } };
        function kn(e, t, n, a) {
          var r,
            i,
            s = e.options,
            o = (function (e, t, n) {
              var a = [n.type, void 0 === t && void 0 === n.stack ? n.index : '', n.stack].join('.');
              return void 0 === e[a] && (e[a] = { pos: [], neg: [] }), e[a];
            })(t, s.stacked, n),
            d = o.pos,
            l = o.neg,
            u = a.length;
          for (r = 0; r < u; ++r)
            (i = e._parseValue(a[r])),
              isNaN(i.min) ||
                isNaN(i.max) ||
                n.data[r].hidden ||
                ((d[r] = d[r] || 0),
                (l[r] = l[r] || 0),
                s.relativePoints ? (d[r] = 100) : i.min < 0 || i.max < 0 ? (l[r] += i.min) : (d[r] += i.max));
        }
        function Dn(e, t, n) {
          var a,
            r,
            i = n.length;
          for (a = 0; a < i; ++a)
            (r = e._parseValue(n[a])),
              isNaN(r.min) ||
                isNaN(r.max) ||
                t.data[a].hidden ||
                ((e.min = Math.min(e.min, r.min)), (e.max = Math.max(e.max, r.max)));
        }
        var wn = Yn.extend({
            determineDataLimits: function () {
              var e,
                t,
                n,
                a,
                r = this,
                i = r.options,
                s = r.chart.data.datasets,
                o = r._getMatchingVisibleMetas(),
                d = i.stacked,
                l = {},
                u = o.length;
              if (((r.min = Number.POSITIVE_INFINITY), (r.max = Number.NEGATIVE_INFINITY), void 0 === d))
                for (e = 0; !d && e < u; ++e) d = void 0 !== (t = o[e]).stack;
              for (e = 0; e < u; ++e) (n = s[(t = o[e]).index].data), d ? kn(r, l, t, n) : Dn(r, t, n);
              R.each(l, function (e) {
                (a = e.pos.concat(e.neg)), (r.min = Math.min(r.min, R.min(a))), (r.max = Math.max(r.max, R.max(a)));
              }),
                (r.min = R.isFinite(r.min) && !isNaN(r.min) ? r.min : 0),
                (r.max = R.isFinite(r.max) && !isNaN(r.max) ? r.max : 1),
                r.handleTickRangeOptions();
            },
            _computeTickLimit: function () {
              var e;
              return this.isHorizontal()
                ? Math.ceil(this.width / 40)
                : ((e = R.options._parseFont(this.options.ticks)), Math.ceil(this.height / e.lineHeight));
            },
            handleDirectionalChanges: function () {
              this.isHorizontal() || this.ticks.reverse();
            },
            getLabelForIndex: function (e, t) {
              return this._getScaleLabel(this.chart.data.datasets[t].data[e]);
            },
            getPixelForValue: function (e) {
              return this.getPixelForDecimal((+this.getRightValue(e) - this._startValue) / this._valueRange);
            },
            getValueForPixel: function (e) {
              return this._startValue + this.getDecimalForPixel(e) * this._valueRange;
            },
            getPixelForTick: function (e) {
              var t = this.ticksAsNumbers;
              return e < 0 || e > t.length - 1 ? null : this.getPixelForValue(t[e]);
            },
          }),
          xn = bn;
        wn._defaults = xn;
        var Tn = R.valueOrDefault,
          Sn = R.math.log10,
          Hn = { position: 'left', ticks: { callback: tn.formatters.logarithmic } };
        function jn(e, t) {
          return R.isFinite(e) && e >= 0 ? e : t;
        }
        var Pn = pn.extend({
            determineDataLimits: function () {
              var e,
                t,
                n,
                a,
                r,
                i,
                s = this,
                o = s.options,
                d = s.chart,
                l = d.data.datasets,
                u = s.isHorizontal();
              function _(e) {
                return u ? e.xAxisID === s.id : e.yAxisID === s.id;
              }
              (s.min = Number.POSITIVE_INFINITY),
                (s.max = Number.NEGATIVE_INFINITY),
                (s.minNotZero = Number.POSITIVE_INFINITY);
              var c = o.stacked;
              if (void 0 === c)
                for (e = 0; e < l.length; e++)
                  if (((t = d.getDatasetMeta(e)), d.isDatasetVisible(e) && _(t) && void 0 !== t.stack)) {
                    c = !0;
                    break;
                  }
              if (o.stacked || c) {
                var h = {};
                for (e = 0; e < l.length; e++) {
                  var m = [
                    (t = d.getDatasetMeta(e)).type,
                    void 0 === o.stacked && void 0 === t.stack ? e : '',
                    t.stack,
                  ].join('.');
                  if (d.isDatasetVisible(e) && _(t))
                    for (void 0 === h[m] && (h[m] = []), r = 0, i = (a = l[e].data).length; r < i; r++) {
                      var f = h[m];
                      (n = s._parseValue(a[r])),
                        isNaN(n.min) ||
                          isNaN(n.max) ||
                          t.data[r].hidden ||
                          n.min < 0 ||
                          n.max < 0 ||
                          ((f[r] = f[r] || 0), (f[r] += n.max));
                    }
                }
                R.each(h, function (e) {
                  if (e.length > 0) {
                    var t = R.min(e),
                      n = R.max(e);
                    (s.min = Math.min(s.min, t)), (s.max = Math.max(s.max, n));
                  }
                });
              } else
                for (e = 0; e < l.length; e++)
                  if (((t = d.getDatasetMeta(e)), d.isDatasetVisible(e) && _(t)))
                    for (r = 0, i = (a = l[e].data).length; r < i; r++)
                      (n = s._parseValue(a[r])),
                        isNaN(n.min) ||
                          isNaN(n.max) ||
                          t.data[r].hidden ||
                          n.min < 0 ||
                          n.max < 0 ||
                          ((s.min = Math.min(n.min, s.min)),
                          (s.max = Math.max(n.max, s.max)),
                          0 !== n.min && (s.minNotZero = Math.min(n.min, s.minNotZero)));
              (s.min = R.isFinite(s.min) ? s.min : null),
                (s.max = R.isFinite(s.max) ? s.max : null),
                (s.minNotZero = R.isFinite(s.minNotZero) ? s.minNotZero : null),
                this.handleTickRangeOptions();
            },
            handleTickRangeOptions: function () {
              var e = this,
                t = e.options.ticks;
              (e.min = jn(t.min, e.min)),
                (e.max = jn(t.max, e.max)),
                e.min === e.max &&
                  (0 !== e.min && null !== e.min
                    ? ((e.min = Math.pow(10, Math.floor(Sn(e.min)) - 1)),
                      (e.max = Math.pow(10, Math.floor(Sn(e.max)) + 1)))
                    : ((e.min = 1), (e.max = 10))),
                null === e.min && (e.min = Math.pow(10, Math.floor(Sn(e.max)) - 1)),
                null === e.max && (e.max = 0 !== e.min ? Math.pow(10, Math.floor(Sn(e.min)) + 1) : 10),
                null === e.minNotZero &&
                  (e.min > 0
                    ? (e.minNotZero = e.min)
                    : e.max < 1
                    ? (e.minNotZero = Math.pow(10, Math.floor(Sn(e.max))))
                    : (e.minNotZero = 1));
            },
            buildTicks: function () {
              var e = this,
                t = e.options.ticks,
                n = !e.isHorizontal(),
                a = { min: jn(t.min), max: jn(t.max) },
                r = (e.ticks = (function (e, t) {
                  var n,
                    a,
                    r = [],
                    i = Tn(e.min, Math.pow(10, Math.floor(Sn(t.min)))),
                    s = Math.floor(Sn(t.max)),
                    o = Math.ceil(t.max / Math.pow(10, s));
                  0 === i
                    ? ((n = Math.floor(Sn(t.minNotZero))),
                      (a = Math.floor(t.minNotZero / Math.pow(10, n))),
                      r.push(i),
                      (i = a * Math.pow(10, n)))
                    : ((n = Math.floor(Sn(i))), (a = Math.floor(i / Math.pow(10, n))));
                  var d = n < 0 ? Math.pow(10, Math.abs(n)) : 1;
                  do {
                    r.push(i),
                      10 == ++a && ((a = 1), (d = ++n >= 0 ? 1 : d)),
                      (i = Math.round(a * Math.pow(10, n) * d) / d);
                  } while (n < s || (n === s && a < o));
                  var l = Tn(e.max, i);
                  return r.push(l), r;
                })(a, e));
              (e.max = R.max(r)),
                (e.min = R.min(r)),
                t.reverse ? ((n = !n), (e.start = e.max), (e.end = e.min)) : ((e.start = e.min), (e.end = e.max)),
                n && r.reverse();
            },
            convertTicksToLabels: function () {
              (this.tickValues = this.ticks.slice()), pn.prototype.convertTicksToLabels.call(this);
            },
            getLabelForIndex: function (e, t) {
              return this._getScaleLabel(this.chart.data.datasets[t].data[e]);
            },
            getPixelForTick: function (e) {
              var t = this.tickValues;
              return e < 0 || e > t.length - 1 ? null : this.getPixelForValue(t[e]);
            },
            _getFirstTickValue: function (e) {
              var t = Math.floor(Sn(e));
              return Math.floor(e / Math.pow(10, t)) * Math.pow(10, t);
            },
            _configure: function () {
              var e = this,
                t = e.min,
                n = 0;
              pn.prototype._configure.call(e),
                0 === t &&
                  ((t = e._getFirstTickValue(e.minNotZero)),
                  (n = Tn(e.options.ticks.fontSize, C.global.defaultFontSize) / e._length)),
                (e._startValue = Sn(t)),
                (e._valueOffset = n),
                (e._valueRange = (Sn(e.max) - Sn(t)) / (1 - n));
            },
            getPixelForValue: function (e) {
              var t = this,
                n = 0;
              return (
                (e = +t.getRightValue(e)) > t.min &&
                  e > 0 &&
                  (n = (Sn(e) - t._startValue) / t._valueRange + t._valueOffset),
                t.getPixelForDecimal(n)
              );
            },
            getValueForPixel: function (e) {
              var t = this,
                n = t.getDecimalForPixel(e);
              return 0 === n && 0 === t.min ? 0 : Math.pow(10, t._startValue + (n - t._valueOffset) * t._valueRange);
            },
          }),
          On = Hn;
        Pn._defaults = On;
        var An = R.valueOrDefault,
          Fn = R.valueAtIndexOrDefault,
          Wn = R.options.resolve,
          Cn = {
            display: !0,
            animate: !0,
            position: 'chartArea',
            angleLines: { display: !0, color: 'rgba(0,0,0,0.1)', lineWidth: 1, borderDash: [], borderDashOffset: 0 },
            gridLines: { circular: !1 },
            ticks: {
              showLabelBackdrop: !0,
              backdropColor: 'rgba(255,255,255,0.75)',
              backdropPaddingY: 2,
              backdropPaddingX: 2,
              callback: tn.formatters.linear,
            },
            pointLabels: {
              display: !0,
              fontSize: 10,
              callback: function (e) {
                return e;
              },
            },
          };
        function En(e) {
          var t = e.ticks;
          return t.display && e.display ? An(t.fontSize, C.global.defaultFontSize) + 2 * t.backdropPaddingY : 0;
        }
        function zn(e, t, n, a, r) {
          return e === a || e === r
            ? { start: t - n / 2, end: t + n / 2 }
            : e < a || e > r
            ? { start: t - n, end: t }
            : { start: t, end: t + n };
        }
        function In(e) {
          return 0 === e || 180 === e ? 'center' : e < 180 ? 'left' : 'right';
        }
        function Nn(e, t, n, a) {
          var r,
            i,
            s = n.y + a / 2;
          if (R.isArray(t)) for (r = 0, i = t.length; r < i; ++r) e.fillText(t[r], n.x, s), (s += a);
          else e.fillText(t, n.x, s);
        }
        function Rn(e, t, n) {
          90 === e || 270 === e ? (n.y -= t.h / 2) : (e > 270 || e < 90) && (n.y -= t.h);
        }
        function Vn(e) {
          return R.isNumber(e) ? e : 0;
        }
        var Bn = Yn.extend({
            setDimensions: function () {
              var e = this;
              (e.width = e.maxWidth),
                (e.height = e.maxHeight),
                (e.paddingTop = En(e.options) / 2),
                (e.xCenter = Math.floor(e.width / 2)),
                (e.yCenter = Math.floor((e.height - e.paddingTop) / 2)),
                (e.drawingArea = Math.min(e.height - e.paddingTop, e.width) / 2);
            },
            determineDataLimits: function () {
              var e = this,
                t = e.chart,
                n = Number.POSITIVE_INFINITY,
                a = Number.NEGATIVE_INFINITY;
              R.each(t.data.datasets, function (r, i) {
                if (t.isDatasetVisible(i)) {
                  var s = t.getDatasetMeta(i);
                  R.each(r.data, function (t, r) {
                    var i = +e.getRightValue(t);
                    isNaN(i) || s.data[r].hidden || ((n = Math.min(i, n)), (a = Math.max(i, a)));
                  });
                }
              }),
                (e.min = n === Number.POSITIVE_INFINITY ? 0 : n),
                (e.max = a === Number.NEGATIVE_INFINITY ? 0 : a),
                e.handleTickRangeOptions();
            },
            _computeTickLimit: function () {
              return Math.ceil(this.drawingArea / En(this.options));
            },
            convertTicksToLabels: function () {
              var e = this;
              Yn.prototype.convertTicksToLabels.call(e),
                (e.pointLabels = e.chart.data.labels.map(function () {
                  var t = R.callback(e.options.pointLabels.callback, arguments, e);
                  return t || 0 === t ? t : '';
                }));
            },
            getLabelForIndex: function (e, t) {
              return +this.getRightValue(this.chart.data.datasets[t].data[e]);
            },
            fit: function () {
              var e = this.options;
              e.display && e.pointLabels.display
                ? (function (e) {
                    var t,
                      n,
                      a,
                      r = R.options._parseFont(e.options.pointLabels),
                      i = { l: 0, r: e.width, t: 0, b: e.height - e.paddingTop },
                      s = {};
                    (e.ctx.font = r.string), (e._pointLabelSizes = []);
                    var o,
                      d,
                      l,
                      u = e.chart.data.labels.length;
                    for (t = 0; t < u; t++) {
                      (a = e.getPointPosition(t, e.drawingArea + 5)),
                        (o = e.ctx),
                        (d = r.lineHeight),
                        (l = e.pointLabels[t]),
                        (n = R.isArray(l)
                          ? { w: R.longestText(o, o.font, l), h: l.length * d }
                          : { w: o.measureText(l).width, h: d }),
                        (e._pointLabelSizes[t] = n);
                      var _ = e.getIndexAngle(t),
                        c = R.toDegrees(_) % 360,
                        h = zn(c, a.x, n.w, 0, 180),
                        m = zn(c, a.y, n.h, 90, 270);
                      h.start < i.l && ((i.l = h.start), (s.l = _)),
                        h.end > i.r && ((i.r = h.end), (s.r = _)),
                        m.start < i.t && ((i.t = m.start), (s.t = _)),
                        m.end > i.b && ((i.b = m.end), (s.b = _));
                    }
                    e.setReductions(e.drawingArea, i, s);
                  })(this)
                : this.setCenterPoint(0, 0, 0, 0);
            },
            setReductions: function (e, t, n) {
              var a = this,
                r = t.l / Math.sin(n.l),
                i = Math.max(t.r - a.width, 0) / Math.sin(n.r),
                s = -t.t / Math.cos(n.t),
                o = -Math.max(t.b - (a.height - a.paddingTop), 0) / Math.cos(n.b);
              (r = Vn(r)),
                (i = Vn(i)),
                (s = Vn(s)),
                (o = Vn(o)),
                (a.drawingArea = Math.min(Math.floor(e - (r + i) / 2), Math.floor(e - (s + o) / 2))),
                a.setCenterPoint(r, i, s, o);
            },
            setCenterPoint: function (e, t, n, a) {
              var r = this,
                i = r.width - t - r.drawingArea,
                s = e + r.drawingArea,
                o = n + r.drawingArea,
                d = r.height - r.paddingTop - a - r.drawingArea;
              (r.xCenter = Math.floor((s + i) / 2 + r.left)),
                (r.yCenter = Math.floor((o + d) / 2 + r.top + r.paddingTop));
            },
            getIndexAngle: function (e) {
              var t = this.chart,
                n = (e * (360 / t.data.labels.length) + ((t.options || {}).startAngle || 0)) % 360;
              return ((n < 0 ? n + 360 : n) * Math.PI * 2) / 360;
            },
            getDistanceFromCenterForValue: function (e) {
              var t = this;
              if (R.isNullOrUndef(e)) return NaN;
              var n = t.drawingArea / (t.max - t.min);
              return t.options.ticks.reverse ? (t.max - e) * n : (e - t.min) * n;
            },
            getPointPosition: function (e, t) {
              var n = this.getIndexAngle(e) - Math.PI / 2;
              return { x: Math.cos(n) * t + this.xCenter, y: Math.sin(n) * t + this.yCenter };
            },
            getPointPositionForValue: function (e, t) {
              return this.getPointPosition(e, this.getDistanceFromCenterForValue(t));
            },
            getBasePosition: function (e) {
              var t = this.min,
                n = this.max;
              return this.getPointPositionForValue(
                e || 0,
                this.beginAtZero ? 0 : t < 0 && n < 0 ? n : t > 0 && n > 0 ? t : 0,
              );
            },
            _drawGrid: function () {
              var e,
                t,
                n,
                a = this,
                r = a.ctx,
                i = a.options,
                s = i.gridLines,
                o = i.angleLines,
                d = An(o.lineWidth, s.lineWidth),
                l = An(o.color, s.color);
              if (
                (i.pointLabels.display &&
                  (function (e) {
                    var t = e.ctx,
                      n = e.options,
                      a = n.pointLabels,
                      r = En(n),
                      i = e.getDistanceFromCenterForValue(n.ticks.reverse ? e.min : e.max),
                      s = R.options._parseFont(a);
                    t.save(), (t.font = s.string), (t.textBaseline = 'middle');
                    for (var o = e.chart.data.labels.length - 1; o >= 0; o--) {
                      var d = 0 === o ? r / 2 : 0,
                        l = e.getPointPosition(o, i + d + 5),
                        u = Fn(a.fontColor, o, C.global.defaultFontColor);
                      t.fillStyle = u;
                      var _ = e.getIndexAngle(o),
                        c = R.toDegrees(_);
                      (t.textAlign = In(c)), Rn(c, e._pointLabelSizes[o], l), Nn(t, e.pointLabels[o], l, s.lineHeight);
                    }
                    t.restore();
                  })(a),
                s.display &&
                  R.each(a.ticks, function (e, n) {
                    0 !== n &&
                      ((t = a.getDistanceFromCenterForValue(a.ticksAsNumbers[n])),
                      (function (e, t, n, a) {
                        var r,
                          i = e.ctx,
                          s = t.circular,
                          o = e.chart.data.labels.length,
                          d = Fn(t.color, a - 1),
                          l = Fn(t.lineWidth, a - 1);
                        if ((s || o) && d && l) {
                          if (
                            (i.save(),
                            (i.strokeStyle = d),
                            (i.lineWidth = l),
                            i.setLineDash &&
                              (i.setLineDash(t.borderDash || []), (i.lineDashOffset = t.borderDashOffset || 0)),
                            i.beginPath(),
                            s)
                          )
                            i.arc(e.xCenter, e.yCenter, n, 0, 2 * Math.PI);
                          else {
                            (r = e.getPointPosition(0, n)), i.moveTo(r.x, r.y);
                            for (var u = 1; u < o; u++) (r = e.getPointPosition(u, n)), i.lineTo(r.x, r.y);
                          }
                          i.closePath(), i.stroke(), i.restore();
                        }
                      })(a, s, t, n));
                  }),
                o.display && d && l)
              ) {
                for (
                  r.save(),
                    r.lineWidth = d,
                    r.strokeStyle = l,
                    r.setLineDash &&
                      (r.setLineDash(Wn([o.borderDash, s.borderDash, []])),
                      (r.lineDashOffset = Wn([o.borderDashOffset, s.borderDashOffset, 0]))),
                    e = a.chart.data.labels.length - 1;
                  e >= 0;
                  e--
                )
                  (t = a.getDistanceFromCenterForValue(i.ticks.reverse ? a.min : a.max)),
                    (n = a.getPointPosition(e, t)),
                    r.beginPath(),
                    r.moveTo(a.xCenter, a.yCenter),
                    r.lineTo(n.x, n.y),
                    r.stroke();
                r.restore();
              }
            },
            _drawLabels: function () {
              var e = this,
                t = e.ctx,
                n = e.options.ticks;
              if (n.display) {
                var a,
                  r,
                  i = e.getIndexAngle(0),
                  s = R.options._parseFont(n),
                  o = An(n.fontColor, C.global.defaultFontColor);
                t.save(),
                  (t.font = s.string),
                  t.translate(e.xCenter, e.yCenter),
                  t.rotate(i),
                  (t.textAlign = 'center'),
                  (t.textBaseline = 'middle'),
                  R.each(e.ticks, function (i, d) {
                    (0 !== d || n.reverse) &&
                      ((a = e.getDistanceFromCenterForValue(e.ticksAsNumbers[d])),
                      n.showLabelBackdrop &&
                        ((r = t.measureText(i).width),
                        (t.fillStyle = n.backdropColor),
                        t.fillRect(
                          -r / 2 - n.backdropPaddingX,
                          -a - s.size / 2 - n.backdropPaddingY,
                          r + 2 * n.backdropPaddingX,
                          s.size + 2 * n.backdropPaddingY,
                        )),
                      (t.fillStyle = o),
                      t.fillText(i, 0, -a));
                  }),
                  t.restore();
              }
            },
            _drawTitle: R.noop,
          }),
          Jn = Cn;
        Bn._defaults = Jn;
        var Un = R._deprecated,
          Gn = R.options.resolve,
          qn = R.valueOrDefault,
          $n = Number.MIN_SAFE_INTEGER || -9007199254740991,
          Kn = Number.MAX_SAFE_INTEGER || 9007199254740991,
          Zn = {
            millisecond: { common: !0, size: 1, steps: 1e3 },
            second: { common: !0, size: 1e3, steps: 60 },
            minute: { common: !0, size: 6e4, steps: 60 },
            hour: { common: !0, size: 36e5, steps: 24 },
            day: { common: !0, size: 864e5, steps: 30 },
            week: { common: !1, size: 6048e5, steps: 4 },
            month: { common: !0, size: 2628e6, steps: 12 },
            quarter: { common: !1, size: 7884e6, steps: 4 },
            year: { common: !0, size: 3154e7 },
          },
          Xn = Object.keys(Zn);
        function Qn(e, t) {
          return e - t;
        }
        function ea(e) {
          return R.valueOrDefault(e.time.min, e.ticks.min);
        }
        function ta(e) {
          return R.valueOrDefault(e.time.max, e.ticks.max);
        }
        function na(e, t, n, a) {
          var r = (function (e, t, n) {
              for (var a, r, i, s = 0, o = e.length - 1; s >= 0 && s <= o; ) {
                if (((r = e[(a = (s + o) >> 1) - 1] || null), (i = e[a]), !r)) return { lo: null, hi: i };
                if (i[t] < n) s = a + 1;
                else {
                  if (!(r[t] > n)) return { lo: r, hi: i };
                  o = a - 1;
                }
              }
              return { lo: i, hi: null };
            })(e, t, n),
            i = r.lo ? (r.hi ? r.lo : e[e.length - 2]) : e[0],
            s = r.lo ? (r.hi ? r.hi : e[e.length - 1]) : e[1],
            o = s[t] - i[t],
            d = o ? (n - i[t]) / o : 0,
            l = (s[a] - i[a]) * d;
          return i[a] + l;
        }
        function aa(e, t) {
          var n = e._adapter,
            a = e.options.time,
            r = a.parser,
            i = r || a.format,
            s = t;
          return (
            'function' == typeof r && (s = r(s)),
            R.isFinite(s) || (s = 'string' == typeof i ? n.parse(s, i) : n.parse(s)),
            null !== s ? +s : (r || 'function' != typeof i || ((s = i(t)), R.isFinite(s) || (s = n.parse(s))), s)
          );
        }
        function ra(e, t) {
          if (R.isNullOrUndef(t)) return null;
          var n = e.options.time,
            a = aa(e, e.getRightValue(t));
          return null === a || (n.round && (a = +e._adapter.startOf(a, n.round))), a;
        }
        function ia(e, t, n, a) {
          var r,
            i,
            s,
            o = Xn.length;
          for (r = Xn.indexOf(e); r < o - 1; ++r)
            if (((s = (i = Zn[Xn[r]]).steps ? i.steps : Kn), i.common && Math.ceil((n - t) / (s * i.size)) <= a))
              return Xn[r];
          return Xn[o - 1];
        }
        function sa(e, t, n) {
          var a,
            r,
            i = [],
            s = {},
            o = t.length;
          for (a = 0; a < o; ++a) (s[(r = t[a])] = a), i.push({ value: r, major: !1 });
          return 0 !== o && n
            ? (function (e, t, n, a) {
                var r,
                  i,
                  s = e._adapter,
                  o = +s.startOf(t[0].value, a),
                  d = t[t.length - 1].value;
                for (r = o; r <= d; r = +s.add(r, 1, a)) (i = n[r]) >= 0 && (t[i].major = !0);
                return t;
              })(e, i, s, n)
            : i;
        }
        var oa = pn.extend({
            initialize: function () {
              this.mergeTicksOptions(), pn.prototype.initialize.call(this);
            },
            update: function () {
              var e = this,
                t = e.options,
                n = t.time || (t.time = {}),
                a = (e._adapter = new en._date(t.adapters.date));
              return (
                Un('time scale', n.format, 'time.format', 'time.parser'),
                Un('time scale', n.min, 'time.min', 'ticks.min'),
                Un('time scale', n.max, 'time.max', 'ticks.max'),
                R.mergeIf(n.displayFormats, a.formats()),
                pn.prototype.update.apply(e, arguments)
              );
            },
            getRightValue: function (e) {
              return e && void 0 !== e.t && (e = e.t), pn.prototype.getRightValue.call(this, e);
            },
            determineDataLimits: function () {
              var e,
                t,
                n,
                a,
                r,
                i,
                s,
                o = this,
                d = o.chart,
                l = o._adapter,
                u = o.options,
                _ = u.time.unit || 'day',
                c = Kn,
                h = $n,
                m = [],
                f = [],
                p = [],
                M = o._getLabels();
              for (e = 0, n = M.length; e < n; ++e) p.push(ra(o, M[e]));
              for (e = 0, n = (d.data.datasets || []).length; e < n; ++e)
                if (d.isDatasetVisible(e))
                  if (((r = d.data.datasets[e].data), R.isObject(r[0])))
                    for (f[e] = [], t = 0, a = r.length; t < a; ++t) (i = ra(o, r[t])), m.push(i), (f[e][t] = i);
                  else (f[e] = p.slice(0)), s || ((m = m.concat(p)), (s = !0));
                else f[e] = [];
              p.length && ((c = Math.min(c, p[0])), (h = Math.max(h, p[p.length - 1]))),
                m.length &&
                  ((m =
                    n > 1
                      ? (function (e) {
                          var t,
                            n,
                            a,
                            r = {},
                            i = [];
                          for (t = 0, n = e.length; t < n; ++t) r[(a = e[t])] || ((r[a] = !0), i.push(a));
                          return i;
                        })(m).sort(Qn)
                      : m.sort(Qn)),
                  (c = Math.min(c, m[0])),
                  (h = Math.max(h, m[m.length - 1]))),
                (c = ra(o, ea(u)) || c),
                (h = ra(o, ta(u)) || h),
                (c = c === Kn ? +l.startOf(Date.now(), _) : c),
                (h = h === $n ? +l.endOf(Date.now(), _) + 1 : h),
                (o.min = Math.min(c, h)),
                (o.max = Math.max(c + 1, h)),
                (o._table = []),
                (o._timestamps = { data: m, datasets: f, labels: p });
            },
            buildTicks: function () {
              var e,
                t,
                n,
                a = this,
                r = a.min,
                i = a.max,
                s = a.options,
                o = s.ticks,
                d = s.time,
                l = a._timestamps,
                u = [],
                _ = a.getLabelCapacity(r),
                c = o.source,
                h = s.distribution;
              for (
                l =
                  'data' === c || ('auto' === c && 'series' === h)
                    ? l.data
                    : 'labels' === c
                    ? l.labels
                    : (function (e, t, n, a) {
                        var r,
                          i = e._adapter,
                          s = e.options,
                          o = s.time,
                          d = o.unit || ia(o.minUnit, t, n, a),
                          l = Gn([o.stepSize, o.unitStepSize, 1]),
                          u = 'week' === d && o.isoWeekday,
                          _ = t,
                          c = [];
                        if (
                          (u && (_ = +i.startOf(_, 'isoWeek', u)),
                          (_ = +i.startOf(_, u ? 'day' : d)),
                          i.diff(n, t, d) > 1e5 * l)
                        )
                          throw t + ' and ' + n + ' are too far apart with stepSize of ' + l + ' ' + d;
                        for (r = _; r < n; r = +i.add(r, l, d)) c.push(r);
                        return (r !== n && 'ticks' !== s.bounds) || c.push(r), c;
                      })(a, r, i, _),
                  'ticks' === s.bounds && l.length && ((r = l[0]), (i = l[l.length - 1])),
                  r = ra(a, ea(s)) || r,
                  i = ra(a, ta(s)) || i,
                  e = 0,
                  t = l.length;
                e < t;
                ++e
              )
                (n = l[e]) >= r && n <= i && u.push(n);
              return (
                (a.min = r),
                (a.max = i),
                (a._unit =
                  d.unit ||
                  (o.autoSkip
                    ? ia(d.minUnit, a.min, a.max, _)
                    : (function (e, t, n, a, r) {
                        var i, s;
                        for (i = Xn.length - 1; i >= Xn.indexOf(n); i--)
                          if (((s = Xn[i]), Zn[s].common && e._adapter.diff(r, a, s) >= t - 1)) return s;
                        return Xn[n ? Xn.indexOf(n) : 0];
                      })(a, u.length, d.minUnit, a.min, a.max))),
                (a._majorUnit =
                  o.major.enabled && 'year' !== a._unit
                    ? (function (e) {
                        for (var t = Xn.indexOf(e) + 1, n = Xn.length; t < n; ++t) if (Zn[Xn[t]].common) return Xn[t];
                      })(a._unit)
                    : void 0),
                (a._table = (function (e, t, n, a) {
                  if ('linear' === a || !e.length)
                    return [
                      { time: t, pos: 0 },
                      { time: n, pos: 1 },
                    ];
                  var r,
                    i,
                    s,
                    o,
                    d,
                    l = [],
                    u = [t];
                  for (r = 0, i = e.length; r < i; ++r) (o = e[r]) > t && o < n && u.push(o);
                  for (u.push(n), r = 0, i = u.length; r < i; ++r)
                    (d = u[r + 1]),
                      (s = u[r - 1]),
                      (o = u[r]),
                      (void 0 !== s && void 0 !== d && Math.round((d + s) / 2) === o) ||
                        l.push({ time: o, pos: r / (i - 1) });
                  return l;
                })(a._timestamps.data, r, i, h)),
                (a._offsets = (function (e, t, n, a, r) {
                  var i,
                    s,
                    o = 0,
                    d = 0;
                  return (
                    r.offset &&
                      t.length &&
                      ((i = na(e, 'time', t[0], 'pos')),
                      (o = 1 === t.length ? 1 - i : (na(e, 'time', t[1], 'pos') - i) / 2),
                      (s = na(e, 'time', t[t.length - 1], 'pos')),
                      (d = 1 === t.length ? s : (s - na(e, 'time', t[t.length - 2], 'pos')) / 2)),
                    { start: o, end: d, factor: 1 / (o + 1 + d) }
                  );
                })(a._table, u, 0, 0, s)),
                o.reverse && u.reverse(),
                sa(a, u, a._majorUnit)
              );
            },
            getLabelForIndex: function (e, t) {
              var n = this,
                a = n._adapter,
                r = n.chart.data,
                i = n.options.time,
                s = r.labels && e < r.labels.length ? r.labels[e] : '',
                o = r.datasets[t].data[e];
              return (
                R.isObject(o) && (s = n.getRightValue(o)),
                i.tooltipFormat
                  ? a.format(aa(n, s), i.tooltipFormat)
                  : 'string' == typeof s
                  ? s
                  : a.format(aa(n, s), i.displayFormats.datetime)
              );
            },
            tickFormatFunction: function (e, t, n, a) {
              var r = this._adapter,
                i = this.options,
                s = i.time.displayFormats,
                o = s[this._unit],
                d = this._majorUnit,
                l = s[d],
                u = n[t],
                _ = i.ticks,
                c = d && l && u && u.major,
                h = r.format(e, a || (c ? l : o)),
                m = c ? _.major : _.minor,
                f = Gn([m.callback, m.userCallback, _.callback, _.userCallback]);
              return f ? f(h, t, n) : h;
            },
            convertTicksToLabels: function (e) {
              var t,
                n,
                a = [];
              for (t = 0, n = e.length; t < n; ++t) a.push(this.tickFormatFunction(e[t].value, t, e));
              return a;
            },
            getPixelForOffset: function (e) {
              var t = this._offsets,
                n = na(this._table, 'time', e, 'pos');
              return this.getPixelForDecimal((t.start + n) * t.factor);
            },
            getPixelForValue: function (e, t, n) {
              var a = null;
              if (
                (void 0 !== t && void 0 !== n && (a = this._timestamps.datasets[n][t]),
                null === a && (a = ra(this, e)),
                null !== a)
              )
                return this.getPixelForOffset(a);
            },
            getPixelForTick: function (e) {
              var t = this.getTicks();
              return e >= 0 && e < t.length ? this.getPixelForOffset(t[e].value) : null;
            },
            getValueForPixel: function (e) {
              var t = this._offsets,
                n = this.getDecimalForPixel(e) / t.factor - t.end,
                a = na(this._table, 'pos', n, 'time');
              return this._adapter._create(a);
            },
            _getLabelSize: function (e) {
              var t = this.options.ticks,
                n = this.ctx.measureText(e).width,
                a = R.toRadians(this.isHorizontal() ? t.maxRotation : t.minRotation),
                r = Math.cos(a),
                i = Math.sin(a),
                s = qn(t.fontSize, C.global.defaultFontSize);
              return { w: n * r + s * i, h: n * i + s * r };
            },
            getLabelWidth: function (e) {
              return this._getLabelSize(e).w;
            },
            getLabelCapacity: function (e) {
              var t = this,
                n = t.options.time,
                a = n.displayFormats,
                r = a[n.unit] || a.millisecond,
                i = t.tickFormatFunction(e, 0, sa(t, [e], t._majorUnit), r),
                s = t._getLabelSize(i),
                o = Math.floor(t.isHorizontal() ? t.width / s.w : t.height / s.h);
              return t.options.offset && o--, o > 0 ? o : 1;
            },
          }),
          da = {
            position: 'bottom',
            distribution: 'linear',
            bounds: 'data',
            adapters: {},
            time: {
              parser: !1,
              unit: !1,
              round: !1,
              displayFormat: !1,
              isoWeekday: !1,
              minUnit: 'millisecond',
              displayFormats: {},
            },
            ticks: { autoSkip: !1, source: 'auto', major: { enabled: !1 } },
          };
        oa._defaults = da;
        var la = { category: yn, linear: wn, logarithmic: Pn, radialLinear: Bn, time: oa },
          ua = {
            datetime: 'MMM D, YYYY, h:mm:ss a',
            millisecond: 'h:mm:ss.SSS a',
            second: 'h:mm:ss a',
            minute: 'h:mm a',
            hour: 'hA',
            day: 'MMM D',
            week: 'll',
            month: 'MMM YYYY',
            quarter: '[Q]Q - YYYY',
            year: 'YYYY',
          };
        en._date.override(
          'function' == typeof e
            ? {
                _id: 'moment',
                formats: function () {
                  return ua;
                },
                parse: function (t, n) {
                  return (
                    'string' == typeof t && 'string' == typeof n ? (t = e(t, n)) : t instanceof e || (t = e(t)),
                    t.isValid() ? t.valueOf() : null
                  );
                },
                format: function (t, n) {
                  return e(t).format(n);
                },
                add: function (t, n, a) {
                  return e(t).add(n, a).valueOf();
                },
                diff: function (t, n, a) {
                  return e(t).diff(e(n), a);
                },
                startOf: function (t, n, a) {
                  return (t = e(t)), 'isoWeek' === n ? t.isoWeekday(a).valueOf() : t.startOf(n).valueOf();
                },
                endOf: function (t, n) {
                  return e(t).endOf(n).valueOf();
                },
                _create: function (t) {
                  return e(t);
                },
              }
            : {},
        ),
          C._set('global', { plugins: { filler: { propagate: !0 } } });
        var _a = {
          dataset: function (e) {
            var t = e.fill,
              n = e.chart,
              a = n.getDatasetMeta(t),
              r = (a && n.isDatasetVisible(t) && a.dataset._children) || [],
              i = r.length || 0;
            return i
              ? function (e, t) {
                  return (t < i && r[t]._view) || null;
                }
              : null;
          },
          boundary: function (e) {
            var t = e.boundary,
              n = t ? t.x : null,
              a = t ? t.y : null;
            return R.isArray(t)
              ? function (e, n) {
                  return t[n];
                }
              : function (e) {
                  return { x: null === n ? e.x : n, y: null === a ? e.y : a };
                };
          },
        };
        function ca(e, t, n) {
          var a,
            r = e._model || {},
            i = r.fill;
          if ((void 0 === i && (i = !!r.backgroundColor), !1 === i || null === i)) return !1;
          if (!0 === i) return 'origin';
          if (((a = parseFloat(i, 10)), isFinite(a) && Math.floor(a) === a))
            return ('-' !== i[0] && '+' !== i[0]) || (a = t + a), !(a === t || a < 0 || a >= n) && a;
          switch (i) {
            case 'bottom':
              return 'start';
            case 'top':
              return 'end';
            case 'zero':
              return 'origin';
            case 'origin':
            case 'start':
            case 'end':
              return i;
            default:
              return !1;
          }
        }
        function ha(e) {
          return (e.el._scale || {}).getPointPositionForValue
            ? (function (e) {
                var t,
                  n,
                  a,
                  r,
                  i,
                  s = e.el._scale,
                  o = s.options,
                  d = s.chart.data.labels.length,
                  l = e.fill,
                  u = [];
                if (!d) return null;
                for (
                  t = o.ticks.reverse ? s.max : s.min,
                    n = o.ticks.reverse ? s.min : s.max,
                    a = s.getPointPositionForValue(0, t),
                    r = 0;
                  r < d;
                  ++r
                )
                  (i =
                    'start' === l || 'end' === l
                      ? s.getPointPositionForValue(r, 'start' === l ? t : n)
                      : s.getBasePosition(r)),
                    o.gridLines.circular && ((i.cx = a.x), (i.cy = a.y), (i.angle = s.getIndexAngle(r) - Math.PI / 2)),
                    u.push(i);
                return u;
              })(e)
            : (function (e) {
                var t,
                  n = e.el._model || {},
                  a = e.el._scale || {},
                  r = e.fill,
                  i = null;
                if (isFinite(r)) return null;
                if (
                  ('start' === r
                    ? (i = void 0 === n.scaleBottom ? a.bottom : n.scaleBottom)
                    : 'end' === r
                    ? (i = void 0 === n.scaleTop ? a.top : n.scaleTop)
                    : void 0 !== n.scaleZero
                    ? (i = n.scaleZero)
                    : a.getBasePixel && (i = a.getBasePixel()),
                  null != i)
                ) {
                  if (void 0 !== i.x && void 0 !== i.y) return i;
                  if (R.isFinite(i)) return { x: (t = a.isHorizontal()) ? i : null, y: t ? null : i };
                }
                return null;
              })(e);
        }
        function ma(e, t, n) {
          var a,
            r = e[t].fill,
            i = [t];
          if (!n) return r;
          for (; !1 !== r && -1 === i.indexOf(r); ) {
            if (!isFinite(r)) return r;
            if (!(a = e[r])) return !1;
            if (a.visible) return r;
            i.push(r), (r = a.fill);
          }
          return !1;
        }
        function fa(e) {
          var t = e.fill,
            n = 'dataset';
          return !1 === t ? null : (isFinite(t) || (n = 'boundary'), _a[n](e));
        }
        function pa(e) {
          return e && !e.skip;
        }
        function Ma(e, t, n, a, r) {
          var i, s, o, d;
          if (a && r) {
            for (e.moveTo(t[0].x, t[0].y), i = 1; i < a; ++i) R.canvas.lineTo(e, t[i - 1], t[i]);
            if (void 0 === n[0].angle)
              for (e.lineTo(n[r - 1].x, n[r - 1].y), i = r - 1; i > 0; --i) R.canvas.lineTo(e, n[i], n[i - 1], !0);
            else
              for (
                s = n[0].cx, o = n[0].cy, d = Math.sqrt(Math.pow(n[0].x - s, 2) + Math.pow(n[0].y - o, 2)), i = r - 1;
                i > 0;
                --i
              )
                e.arc(s, o, d, n[i].angle, n[i - 1].angle, !0);
          }
        }
        function ya(e, t, n, a, r, i) {
          var s,
            o,
            d,
            l,
            u,
            _,
            c,
            h,
            m = t.length,
            f = a.spanGaps,
            p = [],
            M = [],
            y = 0,
            g = 0;
          for (e.beginPath(), s = 0, o = m; s < o; ++s)
            (u = n((l = t[(d = s % m)]._view), d, a)),
              (_ = pa(l)),
              (c = pa(u)),
              i && void 0 === h && _ && (o = m + (h = s + 1)),
              _ && c
                ? ((y = p.push(l)), (g = M.push(u)))
                : y &&
                  g &&
                  (f ? (_ && p.push(l), c && M.push(u)) : (Ma(e, p, M, y, g), (y = g = 0), (p = []), (M = [])));
          Ma(e, p, M, y, g), e.closePath(), (e.fillStyle = r), e.fill();
        }
        var ga = {
            id: 'filler',
            afterDatasetsUpdate: function (e, t) {
              var n,
                a,
                r,
                i,
                s = (e.data.datasets || []).length,
                o = t.propagate,
                d = [];
              for (a = 0; a < s; ++a)
                (i = null),
                  (r = (n = e.getDatasetMeta(a)).dataset) &&
                    r._model &&
                    r instanceof Ye.Line &&
                    (i = { visible: e.isDatasetVisible(a), fill: ca(r, a, s), chart: e, el: r }),
                  (n.$filler = i),
                  d.push(i);
              for (a = 0; a < s; ++a) (i = d[a]) && ((i.fill = ma(d, a, o)), (i.boundary = ha(i)), (i.mapper = fa(i)));
            },
            beforeDatasetsDraw: function (e) {
              var t,
                n,
                a,
                r,
                i,
                s,
                o,
                d = e._getSortedVisibleDatasetMetas(),
                l = e.ctx;
              for (n = d.length - 1; n >= 0; --n)
                (t = d[n].$filler) &&
                  t.visible &&
                  ((r = (a = t.el)._view),
                  (i = a._children || []),
                  (s = t.mapper),
                  (o = r.backgroundColor || C.global.defaultColor),
                  s &&
                    o &&
                    i.length &&
                    (R.canvas.clipArea(l, e.chartArea), ya(l, i, s, r, o, a._loop), R.canvas.unclipArea(l)));
            },
          },
          La = R.rtl.getRtlAdapter,
          va = R.noop,
          Ya = R.valueOrDefault;
        function ba(e, t) {
          return e.usePointStyle && e.boxWidth > t ? t : e.boxWidth;
        }
        C._set('global', {
          legend: {
            display: !0,
            position: 'top',
            align: 'center',
            fullWidth: !0,
            reverse: !1,
            weight: 1e3,
            onClick: function (e, t) {
              var n = t.datasetIndex,
                a = this.chart,
                r = a.getDatasetMeta(n);
              (r.hidden = null === r.hidden ? !a.data.datasets[n].hidden : null), a.update();
            },
            onHover: null,
            onLeave: null,
            labels: {
              boxWidth: 40,
              padding: 10,
              generateLabels: function (e) {
                var t = e.data.datasets,
                  n = e.options.legend || {},
                  a = n.labels && n.labels.usePointStyle;
                return e._getSortedDatasetMetas().map(function (n) {
                  var r = n.controller.getStyle(a ? 0 : void 0);
                  return {
                    text: t[n.index].label,
                    fillStyle: r.backgroundColor,
                    hidden: !e.isDatasetVisible(n.index),
                    lineCap: r.borderCapStyle,
                    lineDash: r.borderDash,
                    lineDashOffset: r.borderDashOffset,
                    lineJoin: r.borderJoinStyle,
                    lineWidth: r.borderWidth,
                    strokeStyle: r.borderColor,
                    pointStyle: r.pointStyle,
                    rotation: r.rotation,
                    datasetIndex: n.index,
                  };
                }, this);
              },
            },
          },
          legendCallback: function (e) {
            var t,
              n,
              a,
              r = document.createElement('ul'),
              i = e.data.datasets;
            for (r.setAttribute('class', e.id + '-legend'), t = 0, n = i.length; t < n; t++)
              ((a = r.appendChild(document.createElement('li'))).appendChild(
                document.createElement('span'),
              ).style.backgroundColor = i[t].backgroundColor),
                i[t].label && a.appendChild(document.createTextNode(i[t].label));
            return r.outerHTML;
          },
        });
        var ka = $.extend({
          initialize: function (e) {
            R.extend(this, e), (this.legendHitBoxes = []), (this._hoveredItem = null), (this.doughnutMode = !1);
          },
          beforeUpdate: va,
          update: function (e, t, n) {
            var a = this;
            return (
              a.beforeUpdate(),
              (a.maxWidth = e),
              (a.maxHeight = t),
              (a.margins = n),
              a.beforeSetDimensions(),
              a.setDimensions(),
              a.afterSetDimensions(),
              a.beforeBuildLabels(),
              a.buildLabels(),
              a.afterBuildLabels(),
              a.beforeFit(),
              a.fit(),
              a.afterFit(),
              a.afterUpdate(),
              a.minSize
            );
          },
          afterUpdate: va,
          beforeSetDimensions: va,
          setDimensions: function () {
            var e = this;
            e.isHorizontal()
              ? ((e.width = e.maxWidth), (e.left = 0), (e.right = e.width))
              : ((e.height = e.maxHeight), (e.top = 0), (e.bottom = e.height)),
              (e.paddingLeft = 0),
              (e.paddingTop = 0),
              (e.paddingRight = 0),
              (e.paddingBottom = 0),
              (e.minSize = { width: 0, height: 0 });
          },
          afterSetDimensions: va,
          beforeBuildLabels: va,
          buildLabels: function () {
            var e = this,
              t = e.options.labels || {},
              n = R.callback(t.generateLabels, [e.chart], e) || [];
            t.filter &&
              (n = n.filter(function (n) {
                return t.filter(n, e.chart.data);
              })),
              e.options.reverse && n.reverse(),
              (e.legendItems = n);
          },
          afterBuildLabels: va,
          beforeFit: va,
          fit: function () {
            var e = this,
              t = e.options,
              n = t.labels,
              a = t.display,
              r = e.ctx,
              i = R.options._parseFont(n),
              s = i.size,
              o = (e.legendHitBoxes = []),
              d = e.minSize,
              l = e.isHorizontal();
            if (
              (l
                ? ((d.width = e.maxWidth), (d.height = a ? 10 : 0))
                : ((d.width = a ? 10 : 0), (d.height = e.maxHeight)),
              a)
            ) {
              if (((r.font = i.string), l)) {
                var u = (e.lineWidths = [0]),
                  _ = 0;
                (r.textAlign = 'left'),
                  (r.textBaseline = 'middle'),
                  R.each(e.legendItems, function (e, t) {
                    var a = ba(n, s) + s / 2 + r.measureText(e.text).width;
                    (0 === t || u[u.length - 1] + a + 2 * n.padding > d.width) &&
                      ((_ += s + n.padding), (u[u.length - (t > 0 ? 0 : 1)] = 0)),
                      (o[t] = { left: 0, top: 0, width: a, height: s }),
                      (u[u.length - 1] += a + n.padding);
                  }),
                  (d.height += _);
              } else {
                var c = n.padding,
                  h = (e.columnWidths = []),
                  m = (e.columnHeights = []),
                  f = n.padding,
                  p = 0,
                  M = 0;
                R.each(e.legendItems, function (e, t) {
                  var a = ba(n, s) + s / 2 + r.measureText(e.text).width;
                  t > 0 && M + s + 2 * c > d.height && ((f += p + n.padding), h.push(p), m.push(M), (p = 0), (M = 0)),
                    (p = Math.max(p, a)),
                    (M += s + c),
                    (o[t] = { left: 0, top: 0, width: a, height: s });
                }),
                  (f += p),
                  h.push(p),
                  m.push(M),
                  (d.width += f);
              }
              (e.width = d.width), (e.height = d.height);
            } else e.width = d.width = e.height = d.height = 0;
          },
          afterFit: va,
          isHorizontal: function () {
            return 'top' === this.options.position || 'bottom' === this.options.position;
          },
          draw: function () {
            var e = this,
              t = e.options,
              n = t.labels,
              a = C.global,
              r = a.defaultColor,
              i = a.elements.line,
              s = e.height,
              o = e.columnHeights,
              d = e.width,
              l = e.lineWidths;
            if (t.display) {
              var u,
                _ = La(t.rtl, e.left, e.minSize.width),
                c = e.ctx,
                h = Ya(n.fontColor, a.defaultFontColor),
                m = R.options._parseFont(n),
                f = m.size;
              (c.textAlign = _.textAlign('left')),
                (c.textBaseline = 'middle'),
                (c.lineWidth = 0.5),
                (c.strokeStyle = h),
                (c.fillStyle = h),
                (c.font = m.string);
              var p = ba(n, f),
                M = e.legendHitBoxes,
                y = function (e, a) {
                  switch (t.align) {
                    case 'start':
                      return n.padding;
                    case 'end':
                      return e - a;
                    default:
                      return (e - a + n.padding) / 2;
                  }
                },
                g = e.isHorizontal();
              (u = g
                ? { x: e.left + y(d, l[0]), y: e.top + n.padding, line: 0 }
                : { x: e.left + n.padding, y: e.top + y(s, o[0]), line: 0 }),
                R.rtl.overrideTextDirection(e.ctx, t.textDirection);
              var L = f + n.padding;
              R.each(e.legendItems, function (t, a) {
                var h = c.measureText(t.text).width,
                  m = p + f / 2 + h,
                  v = u.x,
                  Y = u.y;
                _.setWidth(e.minSize.width),
                  g
                    ? a > 0 &&
                      v + m + n.padding > e.left + e.minSize.width &&
                      ((Y = u.y += L), u.line++, (v = u.x = e.left + y(d, l[u.line])))
                    : a > 0 &&
                      Y + L > e.top + e.minSize.height &&
                      ((v = u.x = v + e.columnWidths[u.line] + n.padding),
                      u.line++,
                      (Y = u.y = e.top + y(s, o[u.line])));
                var b = _.x(v);
                !(function (e, t, a) {
                  if (!(isNaN(p) || p <= 0)) {
                    c.save();
                    var s = Ya(a.lineWidth, i.borderWidth);
                    if (
                      ((c.fillStyle = Ya(a.fillStyle, r)),
                      (c.lineCap = Ya(a.lineCap, i.borderCapStyle)),
                      (c.lineDashOffset = Ya(a.lineDashOffset, i.borderDashOffset)),
                      (c.lineJoin = Ya(a.lineJoin, i.borderJoinStyle)),
                      (c.lineWidth = s),
                      (c.strokeStyle = Ya(a.strokeStyle, r)),
                      c.setLineDash && c.setLineDash(Ya(a.lineDash, i.borderDash)),
                      n && n.usePointStyle)
                    ) {
                      var o = (p * Math.SQRT2) / 2,
                        d = _.xPlus(e, p / 2),
                        l = t + f / 2;
                      R.canvas.drawPoint(c, a.pointStyle, o, d, l, a.rotation);
                    } else
                      c.fillRect(_.leftForLtr(e, p), t, p, f), 0 !== s && c.strokeRect(_.leftForLtr(e, p), t, p, f);
                    c.restore();
                  }
                })(b, Y, t),
                  (M[a].left = _.leftForLtr(b, M[a].width)),
                  (M[a].top = Y),
                  (function (e, t, n, a) {
                    var r = f / 2,
                      i = _.xPlus(e, p + r),
                      s = t + r;
                    c.fillText(n.text, i, s),
                      n.hidden &&
                        (c.beginPath(), (c.lineWidth = 2), c.moveTo(i, s), c.lineTo(_.xPlus(i, a), s), c.stroke());
                  })(b, Y, t, h),
                  g ? (u.x += m + n.padding) : (u.y += L);
              }),
                R.rtl.restoreTextDirection(e.ctx, t.textDirection);
            }
          },
          _getLegendItemAt: function (e, t) {
            var n,
              a,
              r,
              i = this;
            if (e >= i.left && e <= i.right && t >= i.top && t <= i.bottom)
              for (r = i.legendHitBoxes, n = 0; n < r.length; ++n)
                if (e >= (a = r[n]).left && e <= a.left + a.width && t >= a.top && t <= a.top + a.height)
                  return i.legendItems[n];
            return null;
          },
          handleEvent: function (e) {
            var t,
              n = this,
              a = n.options,
              r = 'mouseup' === e.type ? 'click' : e.type;
            if ('mousemove' === r) {
              if (!a.onHover && !a.onLeave) return;
            } else {
              if ('click' !== r) return;
              if (!a.onClick) return;
            }
            (t = n._getLegendItemAt(e.x, e.y)),
              'click' === r
                ? t && a.onClick && a.onClick.call(n, e.native, t)
                : (a.onLeave &&
                    t !== n._hoveredItem &&
                    (n._hoveredItem && a.onLeave.call(n, e.native, n._hoveredItem), (n._hoveredItem = t)),
                  a.onHover && t && a.onHover.call(n, e.native, t));
          },
        });
        function Da(e, t) {
          var n = new ka({ ctx: e.ctx, options: t, chart: e });
          ft.configure(e, n, t), ft.addBox(e, n), (e.legend = n);
        }
        var wa = {
            id: 'legend',
            _element: ka,
            beforeInit: function (e) {
              var t = e.options.legend;
              t && Da(e, t);
            },
            beforeUpdate: function (e) {
              var t = e.options.legend,
                n = e.legend;
              t
                ? (R.mergeIf(t, C.global.legend), n ? (ft.configure(e, n, t), (n.options = t)) : Da(e, t))
                : n && (ft.removeBox(e, n), delete e.legend);
            },
            afterEvent: function (e, t) {
              var n = e.legend;
              n && n.handleEvent(t);
            },
          },
          xa = R.noop;
        C._set('global', {
          title: { display: !1, fontStyle: 'bold', fullWidth: !0, padding: 10, position: 'top', text: '', weight: 2e3 },
        });
        var Ta = $.extend({
          initialize: function (e) {
            R.extend(this, e), (this.legendHitBoxes = []);
          },
          beforeUpdate: xa,
          update: function (e, t, n) {
            var a = this;
            return (
              a.beforeUpdate(),
              (a.maxWidth = e),
              (a.maxHeight = t),
              (a.margins = n),
              a.beforeSetDimensions(),
              a.setDimensions(),
              a.afterSetDimensions(),
              a.beforeBuildLabels(),
              a.buildLabels(),
              a.afterBuildLabels(),
              a.beforeFit(),
              a.fit(),
              a.afterFit(),
              a.afterUpdate(),
              a.minSize
            );
          },
          afterUpdate: xa,
          beforeSetDimensions: xa,
          setDimensions: function () {
            var e = this;
            e.isHorizontal()
              ? ((e.width = e.maxWidth), (e.left = 0), (e.right = e.width))
              : ((e.height = e.maxHeight), (e.top = 0), (e.bottom = e.height)),
              (e.paddingLeft = 0),
              (e.paddingTop = 0),
              (e.paddingRight = 0),
              (e.paddingBottom = 0),
              (e.minSize = { width: 0, height: 0 });
          },
          afterSetDimensions: xa,
          beforeBuildLabels: xa,
          buildLabels: xa,
          afterBuildLabels: xa,
          beforeFit: xa,
          fit: function () {
            var e,
              t = this,
              n = t.options,
              a = (t.minSize = {}),
              r = t.isHorizontal();
            n.display
              ? ((e = (R.isArray(n.text) ? n.text.length : 1) * R.options._parseFont(n).lineHeight + 2 * n.padding),
                (t.width = a.width = r ? t.maxWidth : e),
                (t.height = a.height = r ? e : t.maxHeight))
              : (t.width = a.width = t.height = a.height = 0);
          },
          afterFit: xa,
          isHorizontal: function () {
            var e = this.options.position;
            return 'top' === e || 'bottom' === e;
          },
          draw: function () {
            var e = this,
              t = e.ctx,
              n = e.options;
            if (n.display) {
              var a,
                r,
                i,
                s = R.options._parseFont(n),
                o = s.lineHeight,
                d = o / 2 + n.padding,
                l = 0,
                u = e.top,
                _ = e.left,
                c = e.bottom,
                h = e.right;
              (t.fillStyle = R.valueOrDefault(n.fontColor, C.global.defaultFontColor)),
                (t.font = s.string),
                e.isHorizontal()
                  ? ((r = _ + (h - _) / 2), (i = u + d), (a = h - _))
                  : ((r = 'left' === n.position ? _ + d : h - d),
                    (i = u + (c - u) / 2),
                    (a = c - u),
                    (l = Math.PI * ('left' === n.position ? -0.5 : 0.5))),
                t.save(),
                t.translate(r, i),
                t.rotate(l),
                (t.textAlign = 'center'),
                (t.textBaseline = 'middle');
              var m = n.text;
              if (R.isArray(m)) for (var f = 0, p = 0; p < m.length; ++p) t.fillText(m[p], 0, f, a), (f += o);
              else t.fillText(m, 0, 0, a);
              t.restore();
            }
          },
        });
        function Sa(e, t) {
          var n = new Ta({ ctx: e.ctx, options: t, chart: e });
          ft.configure(e, n, t), ft.addBox(e, n), (e.titleBlock = n);
        }
        var Ha = {},
          ja = ga,
          Pa = wa,
          Oa = {
            id: 'title',
            _element: Ta,
            beforeInit: function (e) {
              var t = e.options.title;
              t && Sa(e, t);
            },
            beforeUpdate: function (e) {
              var t = e.options.title,
                n = e.titleBlock;
              t
                ? (R.mergeIf(t, C.global.title), n ? (ft.configure(e, n, t), (n.options = t)) : Sa(e, t))
                : n && (ft.removeBox(e, n), delete e.titleBlock);
            },
          };
        for (var Aa in ((Ha.filler = ja),
        (Ha.legend = Pa),
        (Ha.title = Oa),
        (Zt.helpers = R),
        (function () {
          function e(e, t, n) {
            var a;
            return (
              'string' == typeof e
                ? ((a = parseInt(e, 10)), -1 !== e.indexOf('%') && (a = (a / 100) * t.parentNode[n]))
                : (a = e),
              a
            );
          }
          function t(e) {
            return null != e && 'none' !== e;
          }
          function n(n, a, r) {
            var i = document.defaultView,
              s = R._getParentNode(n),
              o = i.getComputedStyle(n)[a],
              d = i.getComputedStyle(s)[a],
              l = t(o),
              u = t(d),
              _ = Number.POSITIVE_INFINITY;
            return l || u ? Math.min(l ? e(o, n, r) : _, u ? e(d, s, r) : _) : 'none';
          }
          (R.where = function (e, t) {
            if (R.isArray(e) && Array.prototype.filter) return e.filter(t);
            var n = [];
            return (
              R.each(e, function (e) {
                t(e) && n.push(e);
              }),
              n
            );
          }),
            (R.findIndex = Array.prototype.findIndex
              ? function (e, t, n) {
                  return e.findIndex(t, n);
                }
              : function (e, t, n) {
                  n = void 0 === n ? e : n;
                  for (var a = 0, r = e.length; a < r; ++a) if (t.call(n, e[a], a, e)) return a;
                  return -1;
                }),
            (R.findNextWhere = function (e, t, n) {
              R.isNullOrUndef(n) && (n = -1);
              for (var a = n + 1; a < e.length; a++) {
                var r = e[a];
                if (t(r)) return r;
              }
            }),
            (R.findPreviousWhere = function (e, t, n) {
              R.isNullOrUndef(n) && (n = e.length);
              for (var a = n - 1; a >= 0; a--) {
                var r = e[a];
                if (t(r)) return r;
              }
            }),
            (R.isNumber = function (e) {
              return !isNaN(parseFloat(e)) && isFinite(e);
            }),
            (R.almostEquals = function (e, t, n) {
              return Math.abs(e - t) < n;
            }),
            (R.almostWhole = function (e, t) {
              var n = Math.round(e);
              return n - t <= e && n + t >= e;
            }),
            (R.max = function (e) {
              return e.reduce(function (e, t) {
                return isNaN(t) ? e : Math.max(e, t);
              }, Number.NEGATIVE_INFINITY);
            }),
            (R.min = function (e) {
              return e.reduce(function (e, t) {
                return isNaN(t) ? e : Math.min(e, t);
              }, Number.POSITIVE_INFINITY);
            }),
            (R.sign = Math.sign
              ? function (e) {
                  return Math.sign(e);
                }
              : function (e) {
                  return 0 == (e = +e) || isNaN(e) ? e : e > 0 ? 1 : -1;
                }),
            (R.toRadians = function (e) {
              return e * (Math.PI / 180);
            }),
            (R.toDegrees = function (e) {
              return e * (180 / Math.PI);
            }),
            (R._decimalPlaces = function (e) {
              if (R.isFinite(e)) {
                for (var t = 1, n = 0; Math.round(e * t) / t !== e; ) (t *= 10), n++;
                return n;
              }
            }),
            (R.getAngleFromPoint = function (e, t) {
              var n = t.x - e.x,
                a = t.y - e.y,
                r = Math.sqrt(n * n + a * a),
                i = Math.atan2(a, n);
              return i < -0.5 * Math.PI && (i += 2 * Math.PI), { angle: i, distance: r };
            }),
            (R.distanceBetweenPoints = function (e, t) {
              return Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
            }),
            (R.aliasPixel = function (e) {
              return e % 2 == 0 ? 0 : 0.5;
            }),
            (R._alignPixel = function (e, t, n) {
              var a = e.currentDevicePixelRatio,
                r = n / 2;
              return Math.round((t - r) * a) / a + r;
            }),
            (R.splineCurve = function (e, t, n, a) {
              var r = e.skip ? t : e,
                i = t,
                s = n.skip ? t : n,
                o = Math.sqrt(Math.pow(i.x - r.x, 2) + Math.pow(i.y - r.y, 2)),
                d = Math.sqrt(Math.pow(s.x - i.x, 2) + Math.pow(s.y - i.y, 2)),
                l = o / (o + d),
                u = d / (o + d),
                _ = a * (l = isNaN(l) ? 0 : l),
                c = a * (u = isNaN(u) ? 0 : u);
              return {
                previous: { x: i.x - _ * (s.x - r.x), y: i.y - _ * (s.y - r.y) },
                next: { x: i.x + c * (s.x - r.x), y: i.y + c * (s.y - r.y) },
              };
            }),
            (R.EPSILON = Number.EPSILON || 1e-14),
            (R.splineCurveMonotone = function (e) {
              var t,
                n,
                a,
                r,
                i,
                s,
                o,
                d,
                l,
                u = (e || []).map(function (e) {
                  return { model: e._model, deltaK: 0, mK: 0 };
                }),
                _ = u.length;
              for (t = 0; t < _; ++t)
                if (!(a = u[t]).model.skip) {
                  if (((n = t > 0 ? u[t - 1] : null), (r = t < _ - 1 ? u[t + 1] : null) && !r.model.skip)) {
                    var c = r.model.x - a.model.x;
                    a.deltaK = 0 !== c ? (r.model.y - a.model.y) / c : 0;
                  }
                  !n || n.model.skip
                    ? (a.mK = a.deltaK)
                    : !r || r.model.skip
                    ? (a.mK = n.deltaK)
                    : this.sign(n.deltaK) !== this.sign(a.deltaK)
                    ? (a.mK = 0)
                    : (a.mK = (n.deltaK + a.deltaK) / 2);
                }
              for (t = 0; t < _ - 1; ++t)
                (a = u[t]),
                  (r = u[t + 1]),
                  a.model.skip ||
                    r.model.skip ||
                    (R.almostEquals(a.deltaK, 0, this.EPSILON)
                      ? (a.mK = r.mK = 0)
                      : ((i = a.mK / a.deltaK),
                        (s = r.mK / a.deltaK),
                        (d = Math.pow(i, 2) + Math.pow(s, 2)) <= 9 ||
                          ((o = 3 / Math.sqrt(d)), (a.mK = i * o * a.deltaK), (r.mK = s * o * a.deltaK))));
              for (t = 0; t < _; ++t)
                (a = u[t]).model.skip ||
                  ((n = t > 0 ? u[t - 1] : null),
                  (r = t < _ - 1 ? u[t + 1] : null),
                  n &&
                    !n.model.skip &&
                    ((l = (a.model.x - n.model.x) / 3),
                    (a.model.controlPointPreviousX = a.model.x - l),
                    (a.model.controlPointPreviousY = a.model.y - l * a.mK)),
                  r &&
                    !r.model.skip &&
                    ((l = (r.model.x - a.model.x) / 3),
                    (a.model.controlPointNextX = a.model.x + l),
                    (a.model.controlPointNextY = a.model.y + l * a.mK)));
            }),
            (R.nextItem = function (e, t, n) {
              return n ? (t >= e.length - 1 ? e[0] : e[t + 1]) : t >= e.length - 1 ? e[e.length - 1] : e[t + 1];
            }),
            (R.previousItem = function (e, t, n) {
              return n ? (t <= 0 ? e[e.length - 1] : e[t - 1]) : t <= 0 ? e[0] : e[t - 1];
            }),
            (R.niceNum = function (e, t) {
              var n = Math.floor(R.log10(e)),
                a = e / Math.pow(10, n);
              return (
                (t ? (a < 1.5 ? 1 : a < 3 ? 2 : a < 7 ? 5 : 10) : a <= 1 ? 1 : a <= 2 ? 2 : a <= 5 ? 5 : 10) *
                Math.pow(10, n)
              );
            }),
            (R.requestAnimFrame =
              'undefined' == typeof window
                ? function (e) {
                    e();
                  }
                : window.requestAnimationFrame ||
                  window.webkitRequestAnimationFrame ||
                  window.mozRequestAnimationFrame ||
                  window.oRequestAnimationFrame ||
                  window.msRequestAnimationFrame ||
                  function (e) {
                    return window.setTimeout(e, 1e3 / 60);
                  }),
            (R.getRelativePosition = function (e, t) {
              var n,
                a,
                r = e.originalEvent || e,
                i = e.target || e.srcElement,
                s = i.getBoundingClientRect(),
                o = r.touches;
              o && o.length > 0 ? ((n = o[0].clientX), (a = o[0].clientY)) : ((n = r.clientX), (a = r.clientY));
              var d = parseFloat(R.getStyle(i, 'padding-left')),
                l = parseFloat(R.getStyle(i, 'padding-top')),
                u = parseFloat(R.getStyle(i, 'padding-right')),
                _ = parseFloat(R.getStyle(i, 'padding-bottom')),
                c = s.right - s.left - d - u,
                h = s.bottom - s.top - l - _;
              return {
                x: (n = Math.round((((n - s.left - d) / c) * i.width) / t.currentDevicePixelRatio)),
                y: (a = Math.round((((a - s.top - l) / h) * i.height) / t.currentDevicePixelRatio)),
              };
            }),
            (R.getConstraintWidth = function (e) {
              return n(e, 'max-width', 'clientWidth');
            }),
            (R.getConstraintHeight = function (e) {
              return n(e, 'max-height', 'clientHeight');
            }),
            (R._calculatePadding = function (e, t, n) {
              return (t = R.getStyle(e, t)).indexOf('%') > -1 ? (n * parseInt(t, 10)) / 100 : parseInt(t, 10);
            }),
            (R._getParentNode = function (e) {
              var t = e.parentNode;
              return t && '[object ShadowRoot]' === t.toString() && (t = t.host), t;
            }),
            (R.getMaximumWidth = function (e) {
              var t = R._getParentNode(e);
              if (!t) return e.clientWidth;
              var n = t.clientWidth,
                a = n - R._calculatePadding(t, 'padding-left', n) - R._calculatePadding(t, 'padding-right', n),
                r = R.getConstraintWidth(e);
              return isNaN(r) ? a : Math.min(a, r);
            }),
            (R.getMaximumHeight = function (e) {
              var t = R._getParentNode(e);
              if (!t) return e.clientHeight;
              var n = t.clientHeight,
                a = n - R._calculatePadding(t, 'padding-top', n) - R._calculatePadding(t, 'padding-bottom', n),
                r = R.getConstraintHeight(e);
              return isNaN(r) ? a : Math.min(a, r);
            }),
            (R.getStyle = function (e, t) {
              return e.currentStyle
                ? e.currentStyle[t]
                : document.defaultView.getComputedStyle(e, null).getPropertyValue(t);
            }),
            (R.retinaScale = function (e, t) {
              var n = (e.currentDevicePixelRatio = t || ('undefined' != typeof window && window.devicePixelRatio) || 1);
              if (1 !== n) {
                var a = e.canvas,
                  r = e.height,
                  i = e.width;
                (a.height = r * n),
                  (a.width = i * n),
                  e.ctx.scale(n, n),
                  a.style.height || a.style.width || ((a.style.height = r + 'px'), (a.style.width = i + 'px'));
              }
            }),
            (R.fontString = function (e, t, n) {
              return t + ' ' + e + 'px ' + n;
            }),
            (R.longestText = function (e, t, n, a) {
              var r = ((a = a || {}).data = a.data || {}),
                i = (a.garbageCollect = a.garbageCollect || []);
              a.font !== t && ((r = a.data = {}), (i = a.garbageCollect = []), (a.font = t)), (e.font = t);
              var s,
                o,
                d,
                l,
                u,
                _ = 0,
                c = n.length;
              for (s = 0; s < c; s++)
                if (null != (l = n[s]) && !0 !== R.isArray(l)) _ = R.measureText(e, r, i, _, l);
                else if (R.isArray(l))
                  for (o = 0, d = l.length; o < d; o++)
                    null == (u = l[o]) || R.isArray(u) || (_ = R.measureText(e, r, i, _, u));
              var h = i.length / 2;
              if (h > n.length) {
                for (s = 0; s < h; s++) delete r[i[s]];
                i.splice(0, h);
              }
              return _;
            }),
            (R.measureText = function (e, t, n, a, r) {
              var i = t[r];
              return i || ((i = t[r] = e.measureText(r).width), n.push(r)), i > a && (a = i), a;
            }),
            (R.numberOfLabelLines = function (e) {
              var t = 1;
              return (
                R.each(e, function (e) {
                  R.isArray(e) && e.length > t && (t = e.length);
                }),
                t
              );
            }),
            (R.color = v
              ? function (e) {
                  return e instanceof CanvasGradient && (e = C.global.defaultColor), v(e);
                }
              : function (e) {
                  return console.error('Color.js not found!'), e;
                }),
            (R.getHoverColor = function (e) {
              return e instanceof CanvasPattern || e instanceof CanvasGradient
                ? e
                : R.color(e).saturate(0.5).darken(0.1).rgbString();
            });
        })(),
        (Zt._adapters = en),
        (Zt.Animation = Z),
        (Zt.animationService = X),
        (Zt.controllers = Xe),
        (Zt.DatasetController = ae),
        (Zt.defaults = C),
        (Zt.Element = $),
        (Zt.elements = Ye),
        (Zt.Interaction = it),
        (Zt.layouts = ft),
        (Zt.platform = St),
        (Zt.plugins = Ht),
        (Zt.Scale = pn),
        (Zt.scaleService = jt),
        (Zt.Ticks = tn),
        (Zt.Tooltip = Rt),
        Zt.helpers.each(la, function (e, t) {
          Zt.scaleService.registerScaleType(t, e, e._defaults);
        }),
        Ha))
          Ha.hasOwnProperty(Aa) && Zt.plugins.register(Ha[Aa]);
        Zt.platform.initialize();
        var Fa = Zt;
        return (
          'undefined' != typeof window && (window.Chart = Zt),
          (Zt.Chart = Zt),
          (Zt.Legend = Ha.legend._element),
          (Zt.Title = Ha.title._element),
          (Zt.pluginService = Zt.plugins),
          (Zt.PluginBase = Zt.Element.extend({})),
          (Zt.canvasHelpers = Zt.helpers.canvas),
          (Zt.layoutService = Zt.layouts),
          (Zt.LinearScaleBase = Yn),
          Zt.helpers.each(['Bar', 'Bubble', 'Doughnut', 'Line', 'PolarArea', 'Radar', 'Scatter'], function (e) {
            Zt[e] = function (t, n) {
              return new Zt(t, Zt.helpers.merge(n || {}, { type: e.charAt(0).toLowerCase() + e.slice(1) }));
            };
          }),
          Fa
        );
      })(
        (function () {
          try {
            return n(1781);
          } catch (e) {}
        })(),
      );
    },
    1953: function (e, t, n) {
      var a = n(1793);
      e.exports = function (e, t) {
        return a(e, t);
      };
    },
    1954: function (e, t, n) {
      var a = n(1936),
        r = n(1941),
        i = n(1988),
        s = n(1992),
        o = n(2010),
        d = n(1783),
        l = n(1943),
        u = n(1945),
        _ = '[object Object]',
        c = Object.prototype.hasOwnProperty;
      e.exports = function (e, t, n, h, m, f) {
        var p = d(e),
          M = d(t),
          y = p ? '[object Array]' : o(e),
          g = M ? '[object Array]' : o(t),
          L = (y = '[object Arguments]' == y ? _ : y) == _,
          v = (g = '[object Arguments]' == g ? _ : g) == _,
          Y = y == g;
        if (Y && l(e)) {
          if (!l(t)) return !1;
          (p = !0), (L = !1);
        }
        if (Y && !L) return f || (f = new a()), p || u(e) ? r(e, t, n, h, m, f) : i(e, t, y, n, h, m, f);
        if (!(1 & n)) {
          var b = L && c.call(e, '__wrapped__'),
            k = v && c.call(t, '__wrapped__');
          if (b || k) {
            var D = b ? e.value() : e,
              w = k ? t.value() : t;
            return f || (f = new a()), m(D, w, n, h, f);
          }
        }
        return !!Y && (f || (f = new a()), s(e, t, n, h, m, f));
      };
    },
    1955: function (e, t) {
      e.exports = function () {
        (this.__data__ = []), (this.size = 0);
      };
    },
    1956: function (e, t, n) {
      var a = n(1788),
        r = Array.prototype.splice;
      e.exports = function (e) {
        var t = this.__data__,
          n = a(t, e);
        return !(n < 0) && (n == t.length - 1 ? t.pop() : r.call(t, n, 1), --this.size, !0);
      };
    },
    1957: function (e, t, n) {
      var a = n(1788);
      e.exports = function (e) {
        var t = this.__data__,
          n = a(t, e);
        return n < 0 ? void 0 : t[n][1];
      };
    },
    1958: function (e, t, n) {
      var a = n(1788);
      e.exports = function (e) {
        return a(this.__data__, e) > -1;
      };
    },
    1959: function (e, t, n) {
      var a = n(1788);
      e.exports = function (e, t) {
        var n = this.__data__,
          r = a(n, e);
        return r < 0 ? (++this.size, n.push([e, t])) : (n[r][1] = t), this;
      };
    },
    1960: function (e, t, n) {
      var a = n(1787);
      e.exports = function () {
        (this.__data__ = new a()), (this.size = 0);
      };
    },
    1961: function (e, t) {
      e.exports = function (e) {
        var t = this.__data__,
          n = t.delete(e);
        return (this.size = t.size), n;
      };
    },
    1962: function (e, t) {
      e.exports = function (e) {
        return this.__data__.get(e);
      };
    },
    1963: function (e, t) {
      e.exports = function (e) {
        return this.__data__.has(e);
      };
    },
    1964: function (e, t, n) {
      var a = n(1787),
        r = n(1794),
        i = n(1796);
      e.exports = function (e, t) {
        var n = this.__data__;
        if (n instanceof a) {
          var s = n.__data__;
          if (!r || s.length < 199) return s.push([e, t]), (this.size = ++n.size), this;
          n = this.__data__ = new i(s);
        }
        return n.set(e, t), (this.size = n.size), this;
      };
    },
    1965: function (e, t, n) {
      var a = n(1938),
        r = n(1968),
        i = n(1795),
        s = n(1940),
        o = /^\[object .+?Constructor\]$/,
        d = Function.prototype,
        l = Object.prototype,
        u = d.toString,
        _ = l.hasOwnProperty,
        c = RegExp(
          '^' +
            u
              .call(_)
              .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
              .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
            '$',
        );
      e.exports = function (e) {
        return !(!i(e) || r(e)) && (a(e) ? c : o).test(s(e));
      };
    },
    1966: function (e, t, n) {
      var a = n(1789),
        r = Object.prototype,
        i = r.hasOwnProperty,
        s = r.toString,
        o = a ? a.toStringTag : void 0;
      e.exports = function (e) {
        var t = i.call(e, o),
          n = e[o];
        try {
          e[o] = void 0;
          var a = !0;
        } catch (e) {}
        var r = s.call(e);
        return a && (t ? (e[o] = n) : delete e[o]), r;
      };
    },
    1967: function (e, t) {
      var n = Object.prototype.toString;
      e.exports = function (e) {
        return n.call(e);
      };
    },
    1968: function (e, t, n) {
      var a,
        r = n(1969),
        i = (a = /[^.]+$/.exec((r && r.keys && r.keys.IE_PROTO) || '')) ? 'Symbol(src)_1.' + a : '';
      e.exports = function (e) {
        return !!i && i in e;
      };
    },
    1969: function (e, t, n) {
      var a = n(1782)['__core-js_shared__'];
      e.exports = a;
    },
    1970: function (e, t) {
      e.exports = function (e, t) {
        return null == e ? void 0 : e[t];
      };
    },
    1971: function (e, t, n) {
      var a = n(1972),
        r = n(1787),
        i = n(1794);
      e.exports = function () {
        (this.size = 0), (this.__data__ = { hash: new a(), map: new (i || r)(), string: new a() });
      };
    },
    1972: function (e, t, n) {
      var a = n(1973),
        r = n(1974),
        i = n(1975),
        s = n(1976),
        o = n(1977);
      function d(e) {
        var t = -1,
          n = null == e ? 0 : e.length;
        for (this.clear(); ++t < n; ) {
          var a = e[t];
          this.set(a[0], a[1]);
        }
      }
      (d.prototype.clear = a),
        (d.prototype.delete = r),
        (d.prototype.get = i),
        (d.prototype.has = s),
        (d.prototype.set = o),
        (e.exports = d);
    },
    1973: function (e, t, n) {
      var a = n(1790);
      e.exports = function () {
        (this.__data__ = a ? a(null) : {}), (this.size = 0);
      };
    },
    1974: function (e, t) {
      e.exports = function (e) {
        var t = this.has(e) && delete this.__data__[e];
        return (this.size -= t ? 1 : 0), t;
      };
    },
    1975: function (e, t, n) {
      var a = n(1790),
        r = Object.prototype.hasOwnProperty;
      e.exports = function (e) {
        var t = this.__data__;
        if (a) {
          var n = t[e];
          return '__lodash_hash_undefined__' === n ? void 0 : n;
        }
        return r.call(t, e) ? t[e] : void 0;
      };
    },
    1976: function (e, t, n) {
      var a = n(1790),
        r = Object.prototype.hasOwnProperty;
      e.exports = function (e) {
        var t = this.__data__;
        return a ? void 0 !== t[e] : r.call(t, e);
      };
    },
    1977: function (e, t, n) {
      var a = n(1790);
      e.exports = function (e, t) {
        var n = this.__data__;
        return (this.size += this.has(e) ? 0 : 1), (n[e] = a && void 0 === t ? '__lodash_hash_undefined__' : t), this;
      };
    },
    1978: function (e, t, n) {
      var a = n(1791);
      e.exports = function (e) {
        var t = a(this, e).delete(e);
        return (this.size -= t ? 1 : 0), t;
      };
    },
    1979: function (e, t) {
      e.exports = function (e) {
        var t = typeof e;
        return 'string' == t || 'number' == t || 'symbol' == t || 'boolean' == t ? '__proto__' !== e : null === e;
      };
    },
    1980: function (e, t, n) {
      var a = n(1791);
      e.exports = function (e) {
        return a(this, e).get(e);
      };
    },
    1981: function (e, t, n) {
      var a = n(1791);
      e.exports = function (e) {
        return a(this, e).has(e);
      };
    },
    1982: function (e, t, n) {
      var a = n(1791);
      e.exports = function (e, t) {
        var n = a(this, e),
          r = n.size;
        return n.set(e, t), (this.size += n.size == r ? 0 : 1), this;
      };
    },
    1983: function (e, t, n) {
      var a = n(1796),
        r = n(1984),
        i = n(1985);
      function s(e) {
        var t = -1,
          n = null == e ? 0 : e.length;
        for (this.__data__ = new a(); ++t < n; ) this.add(e[t]);
      }
      (s.prototype.add = s.prototype.push = r), (s.prototype.has = i), (e.exports = s);
    },
    1984: function (e, t) {
      e.exports = function (e) {
        return this.__data__.set(e, '__lodash_hash_undefined__'), this;
      };
    },
    1985: function (e, t) {
      e.exports = function (e) {
        return this.__data__.has(e);
      };
    },
    1986: function (e, t) {
      e.exports = function (e, t) {
        for (var n = -1, a = null == e ? 0 : e.length; ++n < a; ) if (t(e[n], n, e)) return !0;
        return !1;
      };
    },
    1987: function (e, t) {
      e.exports = function (e, t) {
        return e.has(t);
      };
    },
    1988: function (e, t, n) {
      var a = n(1789),
        r = n(1989),
        i = n(1937),
        s = n(1941),
        o = n(1990),
        d = n(1991),
        l = a ? a.prototype : void 0,
        u = l ? l.valueOf : void 0;
      e.exports = function (e, t, n, a, l, _, c) {
        switch (n) {
          case '[object DataView]':
            if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) return !1;
            (e = e.buffer), (t = t.buffer);
          case '[object ArrayBuffer]':
            return !(e.byteLength != t.byteLength || !_(new r(e), new r(t)));
          case '[object Boolean]':
          case '[object Date]':
          case '[object Number]':
            return i(+e, +t);
          case '[object Error]':
            return e.name == t.name && e.message == t.message;
          case '[object RegExp]':
          case '[object String]':
            return e == t + '';
          case '[object Map]':
            var h = o;
          case '[object Set]':
            var m = 1 & a;
            if ((h || (h = d), e.size != t.size && !m)) return !1;
            var f = c.get(e);
            if (f) return f == t;
            (a |= 2), c.set(e, t);
            var p = s(h(e), h(t), a, l, _, c);
            return c.delete(e), p;
          case '[object Symbol]':
            if (u) return u.call(e) == u.call(t);
        }
        return !1;
      };
    },
    1989: function (e, t, n) {
      var a = n(1782).Uint8Array;
      e.exports = a;
    },
    1990: function (e, t) {
      e.exports = function (e) {
        var t = -1,
          n = Array(e.size);
        return (
          e.forEach(function (e, a) {
            n[++t] = [a, e];
          }),
          n
        );
      };
    },
    1991: function (e, t) {
      e.exports = function (e) {
        var t = -1,
          n = Array(e.size);
        return (
          e.forEach(function (e) {
            n[++t] = e;
          }),
          n
        );
      };
    },
    1992: function (e, t, n) {
      var a = n(1993),
        r = Object.prototype.hasOwnProperty;
      e.exports = function (e, t, n, i, s, o) {
        var d = 1 & n,
          l = a(e),
          u = l.length;
        if (u != a(t).length && !d) return !1;
        for (var _ = u; _--; ) {
          var c = l[_];
          if (!(d ? c in t : r.call(t, c))) return !1;
        }
        var h = o.get(e),
          m = o.get(t);
        if (h && m) return h == t && m == e;
        var f = !0;
        o.set(e, t), o.set(t, e);
        for (var p = d; ++_ < u; ) {
          var M = e[(c = l[_])],
            y = t[c];
          if (i) var g = d ? i(y, M, c, t, e, o) : i(M, y, c, e, t, o);
          if (!(void 0 === g ? M === y || s(M, y, n, i, o) : g)) {
            f = !1;
            break;
          }
          p || (p = 'constructor' == c);
        }
        if (f && !p) {
          var L = e.constructor,
            v = t.constructor;
          L == v ||
            !('constructor' in e) ||
            !('constructor' in t) ||
            ('function' == typeof L && L instanceof L && 'function' == typeof v && v instanceof v) ||
            (f = !1);
        }
        return o.delete(e), o.delete(t), f;
      };
    },
    1993: function (e, t, n) {
      var a = n(1994),
        r = n(1996),
        i = n(1797);
      e.exports = function (e) {
        return a(e, i, r);
      };
    },
    1994: function (e, t, n) {
      var a = n(1995),
        r = n(1783);
      e.exports = function (e, t, n) {
        var i = t(e);
        return r(e) ? i : a(i, n(e));
      };
    },
    1995: function (e, t) {
      e.exports = function (e, t) {
        for (var n = -1, a = t.length, r = e.length; ++n < a; ) e[r + n] = t[n];
        return e;
      };
    },
    1996: function (e, t, n) {
      var a = n(1997),
        r = n(1998),
        i = Object.prototype.propertyIsEnumerable,
        s = Object.getOwnPropertySymbols,
        o = s
          ? function (e) {
              return null == e
                ? []
                : ((e = Object(e)),
                  a(s(e), function (t) {
                    return i.call(e, t);
                  }));
            }
          : r;
      e.exports = o;
    },
    1997: function (e, t) {
      e.exports = function (e, t) {
        for (var n = -1, a = null == e ? 0 : e.length, r = 0, i = []; ++n < a; ) {
          var s = e[n];
          t(s, n, e) && (i[r++] = s);
        }
        return i;
      };
    },
    1998: function (e, t) {
      e.exports = function () {
        return [];
      };
    },
    1999: function (e, t, n) {
      var a = n(2e3),
        r = n(1942),
        i = n(1783),
        s = n(1943),
        o = n(1944),
        d = n(1945),
        l = Object.prototype.hasOwnProperty;
      e.exports = function (e, t) {
        var n = i(e),
          u = !n && r(e),
          _ = !n && !u && s(e),
          c = !n && !u && !_ && d(e),
          h = n || u || _ || c,
          m = h ? a(e.length, String) : [],
          f = m.length;
        for (var p in e)
          (!t && !l.call(e, p)) ||
            (h &&
              ('length' == p ||
                (_ && ('offset' == p || 'parent' == p)) ||
                (c && ('buffer' == p || 'byteLength' == p || 'byteOffset' == p)) ||
                o(p, f))) ||
            m.push(p);
        return m;
      };
    },
    2e3: function (e, t) {
      e.exports = function (e, t) {
        for (var n = -1, a = Array(e); ++n < e; ) a[n] = t(n);
        return a;
      };
    },
    2001: function (e, t, n) {
      var a = n(1785),
        r = n(1786);
      e.exports = function (e) {
        return r(e) && '[object Arguments]' == a(e);
      };
    },
    2002: function (e, t) {
      e.exports = function () {
        return !1;
      };
    },
    2003: function (e, t, n) {
      var a = n(1785),
        r = n(1798),
        i = n(1786),
        s = {};
      (s['[object Float32Array]'] =
        s['[object Float64Array]'] =
        s['[object Int8Array]'] =
        s['[object Int16Array]'] =
        s['[object Int32Array]'] =
        s['[object Uint8Array]'] =
        s['[object Uint8ClampedArray]'] =
        s['[object Uint16Array]'] =
        s['[object Uint32Array]'] =
          !0),
        (s['[object Arguments]'] =
          s['[object Array]'] =
          s['[object ArrayBuffer]'] =
          s['[object Boolean]'] =
          s['[object DataView]'] =
          s['[object Date]'] =
          s['[object Error]'] =
          s['[object Function]'] =
          s['[object Map]'] =
          s['[object Number]'] =
          s['[object Object]'] =
          s['[object RegExp]'] =
          s['[object Set]'] =
          s['[object String]'] =
          s['[object WeakMap]'] =
            !1),
        (e.exports = function (e) {
          return i(e) && r(e.length) && !!s[a(e)];
        });
    },
    2004: function (e, t) {
      e.exports = function (e) {
        return function (t) {
          return e(t);
        };
      };
    },
    2005: function (e, t, n) {
      (function (e) {
        var a = n(1939),
          r = t && !t.nodeType && t,
          i = r && 'object' == typeof e && e && !e.nodeType && e,
          s = i && i.exports === r && a.process,
          o = (function () {
            try {
              var e = i && i.require && i.require('util').types;
              return e || (s && s.binding && s.binding('util'));
            } catch (e) {}
          })();
        e.exports = o;
      }.call(this, n(71)(e)));
    },
    2006: function (e, t, n) {
      var a = n(2007),
        r = n(2008),
        i = Object.prototype.hasOwnProperty;
      e.exports = function (e) {
        if (!a(e)) return r(e);
        var t = [];
        for (var n in Object(e)) i.call(e, n) && 'constructor' != n && t.push(n);
        return t;
      };
    },
    2007: function (e, t) {
      var n = Object.prototype;
      e.exports = function (e) {
        var t = e && e.constructor;
        return e === (('function' == typeof t && t.prototype) || n);
      };
    },
    2008: function (e, t, n) {
      var a = n(2009)(Object.keys, Object);
      e.exports = a;
    },
    2009: function (e, t) {
      e.exports = function (e, t) {
        return function (n) {
          return e(t(n));
        };
      };
    },
    2010: function (e, t, n) {
      var a = n(2011),
        r = n(1794),
        i = n(2012),
        s = n(2013),
        o = n(2014),
        d = n(1785),
        l = n(1940),
        u = l(a),
        _ = l(r),
        c = l(i),
        h = l(s),
        m = l(o),
        f = d;
      ((a && '[object DataView]' != f(new a(new ArrayBuffer(1)))) ||
        (r && '[object Map]' != f(new r())) ||
        (i && '[object Promise]' != f(i.resolve())) ||
        (s && '[object Set]' != f(new s())) ||
        (o && '[object WeakMap]' != f(new o()))) &&
        (f = function (e) {
          var t = d(e),
            n = '[object Object]' == t ? e.constructor : void 0,
            a = n ? l(n) : '';
          if (a)
            switch (a) {
              case u:
                return '[object DataView]';
              case _:
                return '[object Map]';
              case c:
                return '[object Promise]';
              case h:
                return '[object Set]';
              case m:
                return '[object WeakMap]';
            }
          return t;
        }),
        (e.exports = f);
    },
    2011: function (e, t, n) {
      var a = n(1784)(n(1782), 'DataView');
      e.exports = a;
    },
    2012: function (e, t, n) {
      var a = n(1784)(n(1782), 'Promise');
      e.exports = a;
    },
    2013: function (e, t, n) {
      var a = n(1784)(n(1782), 'Set');
      e.exports = a;
    },
    2014: function (e, t, n) {
      var a = n(1784)(n(1782), 'WeakMap');
      e.exports = a;
    },
    2015: function (e, t, n) {
      var a = n(2016),
        r = n(2018)(function (e, t, n) {
          a(e, n, t);
        });
      e.exports = r;
    },
    2016: function (e, t, n) {
      var a = n(2017);
      e.exports = function (e, t, n) {
        '__proto__' == t && a ? a(e, t, { configurable: !0, enumerable: !0, value: n, writable: !0 }) : (e[t] = n);
      };
    },
    2017: function (e, t, n) {
      var a = n(1784),
        r = (function () {
          try {
            var e = a(Object, 'defineProperty');
            return e({}, '', {}), e;
          } catch (e) {}
        })();
      e.exports = r;
    },
    2018: function (e, t, n) {
      var a = n(2019),
        r = n(2020),
        i = n(2026),
        s = n(1783);
      e.exports = function (e, t) {
        return function (n, o) {
          var d = s(n) ? a : r,
            l = t ? t() : {};
          return d(n, e, i(o, 2), l);
        };
      };
    },
    2019: function (e, t) {
      e.exports = function (e, t, n, a) {
        for (var r = -1, i = null == e ? 0 : e.length; ++r < i; ) {
          var s = e[r];
          t(a, s, n(s), e);
        }
        return a;
      };
    },
    2020: function (e, t, n) {
      var a = n(2021);
      e.exports = function (e, t, n, r) {
        return (
          a(e, function (e, a, i) {
            t(r, e, n(e), i);
          }),
          r
        );
      };
    },
    2021: function (e, t, n) {
      var a = n(2022),
        r = n(2025)(a);
      e.exports = r;
    },
    2022: function (e, t, n) {
      var a = n(2023),
        r = n(1797);
      e.exports = function (e, t) {
        return e && a(e, t, r);
      };
    },
    2023: function (e, t, n) {
      var a = n(2024)();
      e.exports = a;
    },
    2024: function (e, t) {
      e.exports = function (e) {
        return function (t, n, a) {
          for (var r = -1, i = Object(t), s = a(t), o = s.length; o--; ) {
            var d = s[e ? o : ++r];
            if (!1 === n(i[d], d, i)) break;
          }
          return t;
        };
      };
    },
    2025: function (e, t, n) {
      var a = n(1946);
      e.exports = function (e, t) {
        return function (n, r) {
          if (null == n) return n;
          if (!a(n)) return e(n, r);
          for (var i = n.length, s = t ? i : -1, o = Object(n); (t ? s-- : ++s < i) && !1 !== r(o[s], s, o); );
          return n;
        };
      };
    },
    2026: function (e, t, n) {
      var a = n(2027),
        r = n(2030),
        i = n(2041),
        s = n(1783),
        o = n(2042);
      e.exports = function (e) {
        return 'function' == typeof e ? e : null == e ? i : 'object' == typeof e ? (s(e) ? r(e[0], e[1]) : a(e)) : o(e);
      };
    },
    2027: function (e, t, n) {
      var a = n(2028),
        r = n(2029),
        i = n(1948);
      e.exports = function (e) {
        var t = r(e);
        return 1 == t.length && t[0][2]
          ? i(t[0][0], t[0][1])
          : function (n) {
              return n === e || a(n, e, t);
            };
      };
    },
    2028: function (e, t, n) {
      var a = n(1936),
        r = n(1793);
      e.exports = function (e, t, n, i) {
        var s = n.length,
          o = s,
          d = !i;
        if (null == e) return !o;
        for (e = Object(e); s--; ) {
          var l = n[s];
          if (d && l[2] ? l[1] !== e[l[0]] : !(l[0] in e)) return !1;
        }
        for (; ++s < o; ) {
          var u = (l = n[s])[0],
            _ = e[u],
            c = l[1];
          if (d && l[2]) {
            if (void 0 === _ && !(u in e)) return !1;
          } else {
            var h = new a();
            if (i) var m = i(_, c, u, e, t, h);
            if (!(void 0 === m ? r(c, _, 3, i, h) : m)) return !1;
          }
        }
        return !0;
      };
    },
    2029: function (e, t, n) {
      var a = n(1947),
        r = n(1797);
      e.exports = function (e) {
        for (var t = r(e), n = t.length; n--; ) {
          var i = t[n],
            s = e[i];
          t[n] = [i, s, a(s)];
        }
        return t;
      };
    },
    2030: function (e, t, n) {
      var a = n(1793),
        r = n(2031),
        i = n(2038),
        s = n(1799),
        o = n(1947),
        d = n(1948),
        l = n(1792);
      e.exports = function (e, t) {
        return s(e) && o(t)
          ? d(l(e), t)
          : function (n) {
              var s = r(n, e);
              return void 0 === s && s === t ? i(n, e) : a(t, s, 3);
            };
      };
    },
    2031: function (e, t, n) {
      var a = n(1949);
      e.exports = function (e, t, n) {
        var r = null == e ? void 0 : a(e, t);
        return void 0 === r ? n : r;
      };
    },
    2032: function (e, t, n) {
      var a = n(2033),
        r = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        i = /\\(\\)?/g,
        s = a(function (e) {
          var t = [];
          return (
            46 === e.charCodeAt(0) && t.push(''),
            e.replace(r, function (e, n, a, r) {
              t.push(a ? r.replace(i, '$1') : n || e);
            }),
            t
          );
        });
      e.exports = s;
    },
    2033: function (e, t, n) {
      var a = n(2034);
      e.exports = function (e) {
        var t = a(e, function (e) {
            return 500 === n.size && n.clear(), e;
          }),
          n = t.cache;
        return t;
      };
    },
    2034: function (e, t, n) {
      var a = n(1796);
      function r(e, t) {
        if ('function' != typeof e || (null != t && 'function' != typeof t)) throw new TypeError('Expected a function');
        var n = function () {
          var a = arguments,
            r = t ? t.apply(this, a) : a[0],
            i = n.cache;
          if (i.has(r)) return i.get(r);
          var s = e.apply(this, a);
          return (n.cache = i.set(r, s) || i), s;
        };
        return (n.cache = new (r.Cache || a)()), n;
      }
      (r.Cache = a), (e.exports = r);
    },
    2035: function (e, t, n) {
      var a = n(2036);
      e.exports = function (e) {
        return null == e ? '' : a(e);
      };
    },
    2036: function (e, t, n) {
      var a = n(1789),
        r = n(2037),
        i = n(1783),
        s = n(1800),
        o = a ? a.prototype : void 0,
        d = o ? o.toString : void 0;
      e.exports = function e(t) {
        if ('string' == typeof t) return t;
        if (i(t)) return r(t, e) + '';
        if (s(t)) return d ? d.call(t) : '';
        var n = t + '';
        return '0' == n && 1 / t == -1 / 0 ? '-0' : n;
      };
    },
    2037: function (e, t) {
      e.exports = function (e, t) {
        for (var n = -1, a = null == e ? 0 : e.length, r = Array(a); ++n < a; ) r[n] = t(e[n], n, e);
        return r;
      };
    },
    2038: function (e, t, n) {
      var a = n(2039),
        r = n(2040);
      e.exports = function (e, t) {
        return null != e && r(e, t, a);
      };
    },
    2039: function (e, t) {
      e.exports = function (e, t) {
        return null != e && t in Object(e);
      };
    },
    2040: function (e, t, n) {
      var a = n(1950),
        r = n(1942),
        i = n(1783),
        s = n(1944),
        o = n(1798),
        d = n(1792);
      e.exports = function (e, t, n) {
        for (var l = -1, u = (t = a(t, e)).length, _ = !1; ++l < u; ) {
          var c = d(t[l]);
          if (!(_ = null != e && n(e, c))) break;
          e = e[c];
        }
        return _ || ++l != u ? _ : !!(u = null == e ? 0 : e.length) && o(u) && s(c, u) && (i(e) || r(e));
      };
    },
    2041: function (e, t) {
      e.exports = function (e) {
        return e;
      };
    },
    2042: function (e, t, n) {
      var a = n(2043),
        r = n(2044),
        i = n(1799),
        s = n(1792);
      e.exports = function (e) {
        return i(e) ? a(s(e)) : r(e);
      };
    },
    2043: function (e, t) {
      e.exports = function (e) {
        return function (t) {
          return null == t ? void 0 : t[e];
        };
      };
    },
    2044: function (e, t, n) {
      var a = n(1949);
      e.exports = function (e) {
        return function (t) {
          return a(t, e);
        };
      };
    },
    2045: function (e, t, n) {
      'use strict';
      (function (e) {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          Object.defineProperty(t, 'Chart', {
            enumerable: !0,
            get: function () {
              return i.default;
            },
          }),
          (t.defaults =
            t.Scatter =
            t.Bubble =
            t.Polar =
            t.Radar =
            t.HorizontalBar =
            t.Bar =
            t.Line =
            t.Pie =
            t.Doughnut =
            t.default =
              void 0);
        var a = d(n(0)),
          r = d(n(1)),
          i = d(n(1951)),
          s = d(n(1953)),
          o = d(n(2015));
        function d(e) {
          return e && e.__esModule ? e : { default: e };
        }
        function l() {
          return (l =
            Object.assign ||
            function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
              }
              return e;
            }).apply(this, arguments);
        }
        function u(e) {
          return (u =
            'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e && 'function' == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype
                    ? 'symbol'
                    : typeof e;
                })(e);
        }
        function _(e, t) {
          if (null == e) return {};
          var n,
            a,
            r = (function (e, t) {
              if (null == e) return {};
              var n,
                a,
                r = {},
                i = Object.keys(e);
              for (a = 0; a < i.length; a++) (n = i[a]), t.indexOf(n) >= 0 || (r[n] = e[n]);
              return r;
            })(e, t);
          if (Object.getOwnPropertySymbols) {
            var i = Object.getOwnPropertySymbols(e);
            for (a = 0; a < i.length; a++)
              (n = i[a]), t.indexOf(n) >= 0 || (Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
          }
          return r;
        }
        function c(e, t) {
          var n = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var a = Object.getOwnPropertySymbols(e);
            t &&
              (a = a.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
              })),
              n.push.apply(n, a);
          }
          return n;
        }
        function h(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? c(Object(n), !0).forEach(function (t) {
                  b(e, t, n[t]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : c(Object(n)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                });
          }
          return e;
        }
        function m(e, t) {
          if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
        }
        function f(e, t) {
          for (var n = 0; n < t.length; n++) {
            var a = t[n];
            (a.enumerable = a.enumerable || !1),
              (a.configurable = !0),
              'value' in a && (a.writable = !0),
              Object.defineProperty(e, a.key, a);
          }
        }
        function p(e, t, n) {
          return t && f(e.prototype, t), n && f(e, n), e;
        }
        function M(e, t) {
          if ('function' != typeof t && null !== t)
            throw new TypeError('Super expression must either be null or a function');
          (e.prototype = Object.create(t && t.prototype, {
            constructor: { value: e, writable: !0, configurable: !0 },
          })),
            t && y(e, t);
        }
        function y(e, t) {
          return (y =
            Object.setPrototypeOf ||
            function (e, t) {
              return (e.__proto__ = t), e;
            })(e, t);
        }
        function g(e) {
          var t = (function () {
            if ('undefined' == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ('function' == typeof Proxy) return !0;
            try {
              return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
            } catch (e) {
              return !1;
            }
          })();
          return function () {
            var n,
              a = Y(e);
            if (t) {
              var r = Y(this).constructor;
              n = Reflect.construct(a, arguments, r);
            } else n = a.apply(this, arguments);
            return L(this, n);
          };
        }
        function L(e, t) {
          return !t || ('object' !== u(t) && 'function' != typeof t) ? v(e) : t;
        }
        function v(e) {
          if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return e;
        }
        function Y(e) {
          return (Y = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function (e) {
                return e.__proto__ || Object.getPrototypeOf(e);
              })(e);
        }
        function b(e, t, n) {
          return (
            t in e
              ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 })
              : (e[t] = n),
            e
          );
        }
        var k = void 0 !== e && e.env && 'production',
          D = (function (e) {
            M(n, e);
            var t = g(n);
            function n() {
              var e;
              return (
                m(this, n),
                b(v((e = t.call(this))), 'handleOnClick', function (t) {
                  var n = e.chartInstance,
                    a = e.props,
                    r = a.getDatasetAtEvent,
                    i = a.getElementAtEvent,
                    s = a.getElementsAtEvent,
                    o = a.onElementsClick;
                  r && r(n.getDatasetAtEvent(t), t),
                    i && i(n.getElementAtEvent(t), t),
                    s && s(n.getElementsAtEvent(t), t),
                    o && o(n.getElementsAtEvent(t), t);
                }),
                b(v(e), 'ref', function (t) {
                  e.element = t;
                }),
                (e.chartInstance = void 0),
                e
              );
            }
            return (
              p(n, [
                {
                  key: 'componentDidMount',
                  value: function () {
                    this.renderChart();
                  },
                },
                {
                  key: 'componentDidUpdate',
                  value: function () {
                    if (this.props.redraw) return this.destroyChart(), void this.renderChart();
                    this.updateChart();
                  },
                },
                {
                  key: 'shouldComponentUpdate',
                  value: function (e) {
                    var t = this.props,
                      n = (t.redraw, t.type),
                      a = t.options,
                      r = t.plugins,
                      i = t.legend,
                      o = t.height,
                      d = t.width;
                    if (!0 === e.redraw) return !0;
                    if (o !== e.height || d !== e.width) return !0;
                    if (n !== e.type) return !0;
                    if (!(0, s.default)(i, e.legend)) return !0;
                    if (!(0, s.default)(a, e.options)) return !0;
                    var l = this.transformDataProp(e);
                    return !(0, s.default)(this.shadowDataProp, l) || !(0, s.default)(r, e.plugins);
                  },
                },
                {
                  key: 'componentWillUnmount',
                  value: function () {
                    this.destroyChart();
                  },
                },
                {
                  key: 'transformDataProp',
                  value: function (e) {
                    var t = e.data;
                    return 'function' == typeof t ? t(this.element) : t;
                  },
                },
                {
                  key: 'memoizeDataProps',
                  value: function () {
                    if (this.props.data) {
                      var e = this.transformDataProp(this.props);
                      return (
                        (this.shadowDataProp = h(
                          h({}, e),
                          {},
                          {
                            datasets:
                              e.datasets &&
                              e.datasets.map(function (e) {
                                return h({}, e);
                              }),
                          },
                        )),
                        this.saveCurrentDatasets(),
                        e
                      );
                    }
                  },
                },
                {
                  key: 'checkDatasets',
                  value: function (e) {
                    var t = 'production' !== k && 'prod' !== k,
                      a = this.props.datasetKeyProvider !== n.getLabelAsKey,
                      r = e.length > 1;
                    if (t && r && !a) {
                      var i = !1;
                      e.forEach(function (e) {
                        e.label || (i = !0);
                      }),
                        i &&
                          console.error(
                            '[react-chartjs-2] Warning: Each dataset needs a unique key. By default, the "label" property on each dataset is used. Alternatively, you may provide a "datasetKeyProvider" as a prop that returns a unique key.',
                          );
                    }
                  },
                },
                {
                  key: 'getCurrentDatasets',
                  value: function () {
                    return (
                      (this.chartInstance &&
                        this.chartInstance.config.data &&
                        this.chartInstance.config.data.datasets) ||
                      []
                    );
                  },
                },
                {
                  key: 'saveCurrentDatasets',
                  value: function () {
                    var e = this;
                    (this.datasets = this.datasets || {}),
                      this.getCurrentDatasets().forEach(function (t) {
                        e.datasets[e.props.datasetKeyProvider(t)] = t;
                      });
                  },
                },
                {
                  key: 'updateChart',
                  value: function () {
                    var e = this,
                      t = this.props.options,
                      n = this.memoizeDataProps(this.props);
                    if (this.chartInstance) {
                      t && (this.chartInstance.options = i.default.helpers.configMerge(this.chartInstance.options, t));
                      var a = this.getCurrentDatasets(),
                        r = n.datasets || [];
                      this.checkDatasets(a);
                      var s = (0, o.default)(a, this.props.datasetKeyProvider);
                      this.chartInstance.config.data.datasets = r.map(function (t) {
                        var n = s[e.props.datasetKeyProvider(t)];
                        if (n && n.type === t.type && t.data) {
                          n.data.splice(t.data.length),
                            t.data.forEach(function (e, a) {
                              n.data[a] = t.data[a];
                            });
                          t.data;
                          var a = _(t, ['data']);
                          return h(h({}, n), a);
                        }
                        return t;
                      });
                      n.datasets;
                      var d = _(n, ['datasets']);
                      (this.chartInstance.config.data = h(h({}, this.chartInstance.config.data), d)),
                        this.chartInstance.update();
                    }
                  },
                },
                {
                  key: 'renderChart',
                  value: function () {
                    var e = this.props,
                      t = e.options,
                      a = e.legend,
                      r = e.type,
                      o = e.plugins,
                      d = this.element,
                      l = this.memoizeDataProps();
                    void 0 === a || (0, s.default)(n.defaultProps.legend, a) || (t.legend = a),
                      (this.chartInstance = new i.default(d, { type: r, data: l, options: t, plugins: o }));
                  },
                },
                {
                  key: 'destroyChart',
                  value: function () {
                    if (this.chartInstance) {
                      this.saveCurrentDatasets();
                      var e = Object.values(this.datasets);
                      (this.chartInstance.config.data.datasets = e), this.chartInstance.destroy();
                    }
                  },
                },
                {
                  key: 'render',
                  value: function () {
                    var e = this.props,
                      t = e.height,
                      n = e.width,
                      r = e.id;
                    return a.default.createElement('canvas', {
                      ref: this.ref,
                      height: t,
                      width: n,
                      id: r,
                      onClick: this.handleOnClick,
                    });
                  },
                },
              ]),
              n
            );
          })(a.default.Component);
        b(D, 'getLabelAsKey', function (e) {
          return e.label;
        }),
          b(D, 'propTypes', {
            data: r.default.oneOfType([r.default.object, r.default.func]).isRequired,
            getDatasetAtEvent: r.default.func,
            getElementAtEvent: r.default.func,
            getElementsAtEvent: r.default.func,
            height: r.default.number,
            legend: r.default.object,
            onElementsClick: r.default.func,
            options: r.default.object,
            plugins: r.default.arrayOf(r.default.object),
            redraw: r.default.bool,
            type: function (e, t, n) {
              if (!i.default.controllers[e[t]])
                return new Error('Invalid chart type `' + e[t] + '` supplied to `' + n + '`.');
            },
            width: r.default.number,
            datasetKeyProvider: r.default.func,
          }),
          b(D, 'defaultProps', {
            legend: { display: !0, position: 'bottom' },
            type: 'doughnut',
            height: 150,
            width: 300,
            redraw: !1,
            options: {},
            datasetKeyProvider: D.getLabelAsKey,
          });
        var w = D;
        t.default = w;
        var x = (function (e) {
          M(n, e);
          var t = g(n);
          function n() {
            return m(this, n), t.apply(this, arguments);
          }
          return (
            p(n, [
              {
                key: 'render',
                value: function () {
                  var e = this;
                  return a.default.createElement(
                    D,
                    l({}, this.props, {
                      ref: function (t) {
                        return (e.chartInstance = t && t.chartInstance);
                      },
                      type: 'doughnut',
                    }),
                  );
                },
              },
            ]),
            n
          );
        })(a.default.Component);
        t.Doughnut = x;
        var T = (function (e) {
          M(n, e);
          var t = g(n);
          function n() {
            return m(this, n), t.apply(this, arguments);
          }
          return (
            p(n, [
              {
                key: 'render',
                value: function () {
                  var e = this;
                  return a.default.createElement(
                    D,
                    l({}, this.props, {
                      ref: function (t) {
                        return (e.chartInstance = t && t.chartInstance);
                      },
                      type: 'pie',
                    }),
                  );
                },
              },
            ]),
            n
          );
        })(a.default.Component);
        t.Pie = T;
        var S = (function (e) {
          M(n, e);
          var t = g(n);
          function n() {
            return m(this, n), t.apply(this, arguments);
          }
          return (
            p(n, [
              {
                key: 'render',
                value: function () {
                  var e = this;
                  return a.default.createElement(
                    D,
                    l({}, this.props, {
                      ref: function (t) {
                        return (e.chartInstance = t && t.chartInstance);
                      },
                      type: 'line',
                    }),
                  );
                },
              },
            ]),
            n
          );
        })(a.default.Component);
        t.Line = S;
        var H = (function (e) {
          M(n, e);
          var t = g(n);
          function n() {
            return m(this, n), t.apply(this, arguments);
          }
          return (
            p(n, [
              {
                key: 'render',
                value: function () {
                  var e = this;
                  return a.default.createElement(
                    D,
                    l({}, this.props, {
                      ref: function (t) {
                        return (e.chartInstance = t && t.chartInstance);
                      },
                      type: 'bar',
                    }),
                  );
                },
              },
            ]),
            n
          );
        })(a.default.Component);
        t.Bar = H;
        var j = (function (e) {
          M(n, e);
          var t = g(n);
          function n() {
            return m(this, n), t.apply(this, arguments);
          }
          return (
            p(n, [
              {
                key: 'render',
                value: function () {
                  var e = this;
                  return a.default.createElement(
                    D,
                    l({}, this.props, {
                      ref: function (t) {
                        return (e.chartInstance = t && t.chartInstance);
                      },
                      type: 'horizontalBar',
                    }),
                  );
                },
              },
            ]),
            n
          );
        })(a.default.Component);
        t.HorizontalBar = j;
        var P = (function (e) {
          M(n, e);
          var t = g(n);
          function n() {
            return m(this, n), t.apply(this, arguments);
          }
          return (
            p(n, [
              {
                key: 'render',
                value: function () {
                  var e = this;
                  return a.default.createElement(
                    D,
                    l({}, this.props, {
                      ref: function (t) {
                        return (e.chartInstance = t && t.chartInstance);
                      },
                      type: 'radar',
                    }),
                  );
                },
              },
            ]),
            n
          );
        })(a.default.Component);
        t.Radar = P;
        var O = (function (e) {
          M(n, e);
          var t = g(n);
          function n() {
            return m(this, n), t.apply(this, arguments);
          }
          return (
            p(n, [
              {
                key: 'render',
                value: function () {
                  var e = this;
                  return a.default.createElement(
                    D,
                    l({}, this.props, {
                      ref: function (t) {
                        return (e.chartInstance = t && t.chartInstance);
                      },
                      type: 'polarArea',
                    }),
                  );
                },
              },
            ]),
            n
          );
        })(a.default.Component);
        t.Polar = O;
        var A = (function (e) {
          M(n, e);
          var t = g(n);
          function n() {
            return m(this, n), t.apply(this, arguments);
          }
          return (
            p(n, [
              {
                key: 'render',
                value: function () {
                  var e = this;
                  return a.default.createElement(
                    D,
                    l({}, this.props, {
                      ref: function (t) {
                        return (e.chartInstance = t && t.chartInstance);
                      },
                      type: 'bubble',
                    }),
                  );
                },
              },
            ]),
            n
          );
        })(a.default.Component);
        t.Bubble = A;
        var F = (function (e) {
          M(n, e);
          var t = g(n);
          function n() {
            return m(this, n), t.apply(this, arguments);
          }
          return (
            p(n, [
              {
                key: 'render',
                value: function () {
                  var e = this;
                  return a.default.createElement(
                    D,
                    l({}, this.props, {
                      ref: function (t) {
                        return (e.chartInstance = t && t.chartInstance);
                      },
                      type: 'scatter',
                    }),
                  );
                },
              },
            ]),
            n
          );
        })(a.default.Component);
        t.Scatter = F;
        var W = i.default.defaults;
        t.defaults = W;
      }.call(this, n(17)));
    },
  },
]);
