const _ = require('lodash');

exports.kN = (a)=>{
  let ub = Array.prototype.every ? function (a, b) {
    return Array.prototype.every.call(a, b, void 0);
  } : function (a, b) {
    for (var c = a.length, d = "string" === typeof a ? a.split("") : a, e = 0; e < c; e++){
      if (e in d && !b.call(void 0, d[e], e, a)) return !1;
    }
    return !0;
  };

  a = [
    (a & 16711680) >>> 16,
    (a & 65280) >>> 8,
    a & 255,
    (a & 4278190080) >>> 24,
  ];
  var b = ub(a, function (c) {
    return c == (c & 255);
  });
  a[3] = (a[3] / 255).toFixed(3);
  if (!b) throw Error('"(' + a.join(",") + '") is not a valid RGBA color');
  return "rgba(" + a.join(",") + ")";
}

exports.fv = (input, query, justOne = false) => {
  const iterate = (x, y) => {
    var r = [];

    x.hasOwnProperty(y) && r.push(x[y]);
    if (justOne && x.hasOwnProperty(y)) {
      return r.shift();
    }

    if (x instanceof Array) {
      for (let i = 0; i < x.length; i++) {
        r = r.concat(iterate(x[i], y));
      }
    } else if (x instanceof Object) {
      const c = Object.keys(x);
      if (c.length > 0) {
        for (let i = 0; i < c.length; i++) {
          r = r.concat(iterate(x[c[i]], y));
        }
      }
    }
    return r.length == 1 ? r.shift() : r;
  };

  let d = query.split(':'),
    v = input;
  for (let i = 0; i < d.length; i++) {
    v = iterate(v, d[i]);
  }
  return v;
};

exports.hms2ms = (v) => {
  try {
    let p = v.split(':'),
      s = 0,
      f = 1;
    while (p.length > 0) {
      s += f * parseInt(p.pop(), 10);
      f *= 60;
    }
    return s * 1e3;
  } catch (e) {
    return 0;
  }
};

exports.createApiContext = (ytcfg) => {
  return {
    context: {
      capabilities: {},
      client: {
        clientName: ytcfg.INNERTUBE_CLIENT_NAME,
        clientVersion: ytcfg.INNERTUBE_CLIENT_VERSION,
        experimentIds: [],
        experimentsToken: '',
        gl: ytcfg.GL,
        hl: ytcfg.HL,
        locationInfo: {
          locationPermissionAuthorizationStatus:
            'LOCATION_PERMISSION_AUTHORIZATION_STATUS_UNSUPPORTED',
        },
        musicAppInfo: {
          musicActivityMasterSwitch:
            'MUSIC_ACTIVITY_MASTER_SWITCH_INDETERMINATE',
          musicLocationMasterSwitch:
            'MUSIC_LOCATION_MASTER_SWITCH_INDETERMINATE',
          pwaInstallabilityStatus: 'PWA_INSTALLABILITY_STATUS_UNKNOWN',
        },
        utcOffsetMinutes: -new Date().getTimezoneOffset(),
      },
      request: {
        internalExperimentFlags: [
          {
            key: 'force_music_enable_outertube_tastebuilder_browse',
            value: 'true',
          },
          {
            key: 'force_music_enable_outertube_playlist_detail_browse',
            value: 'true',
          },
          {
            key: 'force_music_enable_outertube_search_suggestions',
            value: 'true',
          },
        ],
        sessionIndex: {},
      },
      user: {
        enableSafetyMode: false,
      },
    },
  };
};

exports.getCategoryURI = (categoryName) => {
  var b64Key = '';
  switch (_.upperCase(categoryName)) {
    case 'SONG':
      b64Key = 'RAAGAAgACgA';
      break;
    case 'VIDEO':
      b64Key = 'BABGAAgACgA';
      break;
    case 'ALBUM':
      b64Key = 'BAAGAEgACgA';
      break;
    case 'ARTIST':
      b64Key = 'BAAGAAgASgA';
      break;
    case 'PLAYLIST':
      b64Key = 'BAAGAAgACgB';
      break;
  }

  if (b64Key.length > 0) {
    return `Eg-KAQwIA${b64Key}MABqChAEEAMQCRAFEAo%3D`;
  } else {
    return null;
  }
};

exports.buildEndpointContext = (typeName, browseId) => {
  return {
    browseEndpointContextSupportedConfigs: {
      browseEndpointContextMusicConfig: {
        pageType: `MUSIC_PAGE_TYPE_${_.upperCase(typeName)}`,
      },
    },
    browseId: browseId,
  };
};
