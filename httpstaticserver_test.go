package main

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestDefaultRootDirUsesExecutableDirectory(t *testing.T) {
	root := defaultRootDir()
	if root == "" || root == "." || root == "./" {
		t.Fatalf("default root directory must be the executable directory, got %q", root)
	}
	if !filepath.IsAbs(root) {
		t.Fatalf("default root directory must be absolute, got %q", root)
	}
}

func TestHTTPStaticServerSetsContentSecurityPolicy(t *testing.T) {
	root, err := os.MkdirTemp("", "gohttpserver-csp-*")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(root)

	server := NewHTTPStaticServer(root, true)
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, "/", nil)

	server.ServeHTTP(recorder, request)

	// 确认所有响应都会带上 CSP 头，给上传内容和预览页面增加兜底防护。
	if got := recorder.Header().Get("Content-Security-Policy"); got != contentSecurityPolicy {
		t.Fatalf("Content-Security-Policy header = %q, want %q", got, contentSecurityPolicy)
	}
	if !strings.Contains(contentSecurityPolicy, "'unsafe-eval'") {
		t.Fatal("CSP must allow unsafe-eval because Vue 1 compiles browser templates with dynamic functions")
	}
}

func TestReadmePreviewShowdownDisablesHTML(t *testing.T) {
	data, err := os.ReadFile("assets/js/index.js")
	if err != nil {
		t.Fatal(err)
	}

	// README 预览不应允许 Markdown 中的原始 HTML 直接穿透到页面。
	if !strings.Contains(string(data), "noHTML: true") {
		t.Fatal("showdown converter must disable raw HTML passthrough with noHTML: true")
	}
}

func TestReadmePreviewTemplateEscapesContent(t *testing.T) {
	data, err := os.ReadFile("assets/index.html")
	if err != nil {
		t.Fatal(err)
	}
	template := string(data)

	// Vue 三花括号会输出未转义 HTML，这里必须保持为双花括号转义插值。
	if strings.Contains(template, "{{{preview.contentHTML") || strings.Contains(template, "{{{ preview.contentHTML") {
		t.Fatal("README preview must not use Vue raw-HTML triple curly interpolation")
	}
	if !strings.Contains(template, "{{ preview.contentHTML }}") {
		t.Fatal("README preview must use escaped Vue double curly interpolation")
	}
}

func TestIndexUsesPatchedBootstrapSource(t *testing.T) {
	data, err := os.ReadFile("assets/index.html")
	if err != nil {
		t.Fatal(err)
	}
	template := string(data)

	// 页面应加载已同步安全修补的 bootstrap.js，避免继续执行旧的压缩版选择器逻辑。
	if strings.Contains(template, "bootstrap.min.js") {
		t.Fatal("index template must not load bootstrap.min.js with the old selector handling")
	}
	if !strings.Contains(template, "bootstrap-3.3.5/js/bootstrap.js") {
		t.Fatal("index template must load the patched bootstrap.js")
	}
}
