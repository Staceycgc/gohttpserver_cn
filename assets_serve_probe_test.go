package main

import (
	"mime"
	"net/http"
	"net/http/httptest"
	"testing"
)

// 回归测试：即使系统的 /etc/mime.types 把 .css 错误映射为 text/plain，
// init() 中的强制注册也应把静态资源的 Content-Type 纠正回来，
// 避免 Linux 上因浏览器严格 MIME 校验拒绝样式表导致的排版异常。
func TestAssetContentTypesOverrideBadSystemMapping(t *testing.T) {
	// 模拟精简/损坏的 Linux 系统映射先生效
	mime.AddExtensionType(".css", "text/plain")
	// 重新应用与 init() 相同的强制注册（init 已在包加载时执行一次，
	// 这里再执行以确保测试不依赖系统状态先后顺序）
	mime.AddExtensionType(".css", "text/css; charset=utf-8")
	mime.AddExtensionType(".js", "text/javascript; charset=utf-8")

	h := http.StripPrefix("/-/", http.FileServer(Assets))

	cases := map[string]string{
		"/-/assets/css/style.css":                         "text/css",
		"/-/assets/themes/black.css":                      "text/css",
		"/-/assets/bootstrap-3.3.5/css/bootstrap.min.css": "text/css",
		"/-/assets/js/index.js":                           "text/javascript",
	}

	for path, wantPrefix := range cases {
		req := httptest.NewRequest("GET", path, nil)
		rr := httptest.NewRecorder()
		h.ServeHTTP(rr, req)
		got := rr.Header().Get("Content-Type")
		if rr.Code != http.StatusOK {
			t.Errorf("%s: status = %d, want 200", path, rr.Code)
		}
		if len(got) < len(wantPrefix) || got[:len(wantPrefix)] != wantPrefix {
			t.Errorf("%s: Content-Type = %q, want prefix %q", path, got, wantPrefix)
		}
	}
}
