local api = require("api")
local t = www.tag

local page = t("html", {}, {
	t("head", {}, {
		t("title", {}, "gamelib"),
		t("meta", { charset = "utf-8", }),
		t("style", {}, www.styles(styles)),
	}),
	t("body", {}, {
		t("div", { id = "main", }, {
			t("div", { id = "sidebar", }, table.map(api, function(section)
				return t("div", { class = "section", }, {
					t("p", { class = "title" }, section.name),
					t("div", {}, table.map(section.functions, function(f)
						return t("a", { class = "entry", href="#" .. f.name, }, f.name .. "()")
					end))
				})
			end)),
			t("div", { id = "content", }, table.map(api, function(section)
				return t("div", {}, table.map(section.functions, function(f)
					local paren = "("
					for i, a in ipairs(f.args) do
						paren = paren .. a.name
						if (i < #f.args) then
							paren = paren .. ", "
						end
					end
					paren = paren .. ")"
					return t("div", { id = f.name, class = "entry" }, {
						t("a", { class = "title", }, f.name .. paren),
						t("p", { class = "desc", }, f.desc),
					})
				end))
			end)),
		}),
	}),
})

fs.write("doc.html", page)

