var default_config = {
	/**
	 * force_https		ǿ��Ҫ����ڷ���Э��https��ͨ��http-header.x-forwarded-proto�����жϡ�
	 */
	force_https: true
	/**
	 * backend_https	ǿ��Ҫ���վ���ʣ�R2�׶Σ�ʹ��https����˽����Ҫ�󲻸ߣ�������Ϊfalse��ʡЩ����ʱ�䡣
	 */
	,backend_https : false
	/**
	 * server_header	����Զ���serverͷ����Ϊnull����ӡ�
	 */
	,server_header : 'MyServer'
	/**
	 * force_cached_time	�����ָʾ�����棬�Ƿ���Բ�ǿ�ƻ����ʱ�䣬��λ�롣�������޻������������Ϊ������
	 */
	,force_cached_time : 1800
	/**
	 * gzip_r4			�����귵����Ӧʱ��R4�׶Σ��Ƿ���gzipѹ��������ǰ��nginx����/CDN����Ӧ������ʹ��nginxѹ����
	 */
	,gzip_r4 : false
	/**
	 * logging			�Ƿ����ü�log��־
	 */
	,logging : true
	/**
	 * trust_proxy		�Ƿ�����ǰ�˴����ȡ��ʵip��ַ��������nginx��cdn���ʱ��Ҫ�򿪣���
	 */
	,trust_proxy : true
};

var rules = {
	html : [{
			"pathRegex" : /\/(search|webhp)/,
			"pattern" : /onmousedown=\"[^\"]+?\"/g,
			"replacement" : "target=\"_blank\""
			/* ���� /search rwt */
		}, {
			"pathRegex" : /\/(search|webhp)/,
			"pattern" : /onmousedown\\\\x3d\\\\x22.+?\\\\x22/g,
			"replacement" : "target\\\\x3d\\\\x22_blank\\\\x22"
		}, {
			"pattern" : /pushdown_promo:/,
			"replacement" : "_:"
			/* �˵��ֻ�����banner */
		}, {
			"pattern" : /\/\/(?=ssl\.)/g,
			"replacement" : "/!"
			/* ��д���Ե�ַ */
		}, {
			"pattern" : /([htps]+:)?\/\/www\.google\.com/g,
			"replacement" : ""
			/* ��д���Ե�ַ */
		}, {
			"pattern" : /google\.log=/,
			"replacement" : "google.log=function(){};_log="
			/* ����log��ȥ��gen_204���� */
		}
	],
	js : [{
			"pattern" : /([htps]+:)?\/\/www\.google\.com/g,
			"replacement" : ""
			/* ��дxjs,rs���Ե�ַ */
		}, {
			"pattern" : /_\.mg=/,
			"replacement" : "_.mg=function(){};_mg="
			/* ���ü�����ȥ��gen_204���� */
		}
	],
	json : [{
			"pattern" : /onmousedown\\\\x3d\\\\x22.+?\\\\x22/g,
			"replacement" : "target\\\\x3d\\\\x22_blank\\\\x22"
		}
	]
};

global.apply = function (o, c, defaults) {
	if (defaults) {
		apply(o, defaults);
	}
	if (o && c && typeof c == 'object') {
		for (var p in c) {
			o[p] = c[p];
		}
	}
	return o;
};

apply(String.prototype, {
	contains : function (str) {
		return str && this.indexOf(str) > -1;
	},
	startsWith : function (prefix) {
		return prefix && this.length >= prefix.length && this.substring(0, prefix.length) === prefix;
	},
	endsWith : function (suffix) {
		return suffix && this.length >= suffix.length && this.slice(-suffix.length) === suffix;
	},
	hashCode : function () {
		if (this.length === 0)
			return 0;
		var hash = 0,
		charAt,
		i,
		len = this.length;
		for (i = 0; i < len; i++) {
			charAt = this.charCodeAt(i);
			hash = ((hash << 5) - hash) + charAt;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	}
});

var sysconf = (function () {
	var env_pri = process.env.ENV_PRI;
	if (env_pri)
		return apply({}, process.env, default_config);
	else
		return default_config;
})();

module.exports = {
	sysconf : sysconf,
	rules : rules
};
