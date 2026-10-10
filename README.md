# 张春一课题组主页

为 GitHub Pages 准备的英文静态网站，包含研究方向、代表作、文章列表、课题组成员、导师简介及招生信息。无前端依赖，无需购买服务器。网站支持中英文切换，默认显示英文，并记住访客选择。

## 发布状态

2026-10-10：用户已确认最终版并授权发布到 ChunyiZh 的 GitHub Pages。网站地址：[https://chunyizh.github.io/](https://chunyizh.github.io/)。

## 预览

直接打开 `index.html` 即可查看。也可以在目录内运行 `python3 -m http.server 8765 --bind 127.0.0.1`，再访问 `http://127.0.0.1:8765`。

## 发布到 GitHub Pages

1. 登录你的 GitHub 账号，创建一个公开仓库，名称为 `你的用户名.github.io`。如该仓库已经存在，请合并网站文件，保留需要的旧内容。
2. 把本目录中的网站文件上传到仓库根目录。需要包含 `assets/`、`.github/workflows/pages.yml`、`publications.tsv` 和 `build.py`；不要把整个上级 funding 目录上传。解压发布包后上传文件，不要仅上传 ZIP 本身。
3. 在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。
4. 在 **Actions → Publish academic homepage → Run workflow** 中运行一次。之后提交到 `main` 分支会自动生成文章列表并发布。
5. 部署成功后，网站地址为 `https://你的用户名.github.io/`。仓库默认分支如果不是 `main`，需修改 `.github/workflows/pages.yml` 的分支设置。

如果只希望手动上传网页，可使用已生成的 `index.html`、`styles.css`、`app.js`、`assets/` 和 `.nojekyll`，在 Pages 设置中选择 **Deploy from a branch → main → /(root)**。此方式更新论文后需先在本地运行 `python3 build.py`，再上传生成后的 `index.html`。

发布流程依据 [GitHub Pages 官方创建指南](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) 及 [官方静态网站部署模板](https://github.com/actions/starter-workflows/blob/main/pages/static.yml)。

## 日常更新

- **文章列表**：编辑 `publications.tsv`，每行一条，使用制表符分隔。保存 `id`、`year`、`title`、`authors` 和 `venue` 五个必填列，以及可选的 `doi`、`source_url` 两列。Scholar 条目的 `id` 使用 `citation_for_view` 冒号后的标识；直接从期刊官网新增的条目使用唯一自定义 `id` 并填写 `source_url`，不会生成虚假的 Scholar 链接。GitHub Actions 会自动生成网页；本地更新则运行 `python3 build.py`。
- **个人简介、研究介绍、成员**：编辑 `index.template.html`，对应的中英文内容一并维护。
- **照片、研究图**：替换 `assets/` 中对应文件。
- **颜色、版式**：编辑 `styles.css`。
- **代表作及 DOI**：编辑 `build.py` 中的 `DOIS` 与对应说明。

不设置访客跟踪，不收集申请材料；联系按钮打开访客自己的邮件软件。

## 内容来源与整理说明

研究方向英文依据原展板介绍翻译，仅保留研究内容；按用户要求删除成果发表概述。网站提供中英文版本；中文研究介绍沿用原海报文字。


个人经历、成员及图像来自用户提供的《展板-张春一.pptx》，原文件未复制到网站目录。成员照片已根据原展板中姓名与图片的位置对应。康旭鑫为用户于 2026-10-10 新增的博士后成员，照片使用同日提供的原始图片。

文章来自 [Chunyi Zhang 的 Google Scholar](https://scholar.google.com/citations?hl=en&user=Kq_sijoAAAAJ&view_op=list_works&sortby=pubdate)，读取日期为 **2026-10-08**。展开 Show more 至禁用状态后共读取 **37 个条目**：22 篇期刊论文、4 条预印本、11 条会议摘要。2026-10-10 根据用户提供的 ACS 期刊官网新增《How Ions Reshape the Infrared Spectra of Aqueous NaCl》，作者、卷期、页码及 DOI 已核对（17(40), 11364–11373；DOI: 10.1021/acs.jpclett.6c02161），当前共 **38 个条目**（23 篇期刊论文、4 条预印本、11 条会议摘要）。按年份降序排列；同年份内保留原始顺序。会议摘要及预印本保留为独立条目，未与发表版本合并。

作者沿用 Scholar 的姓名缩写，列表页截断处使用 et al.。2024 年 Nature Communications 代表作的完整作者列表由期刊原文补齐。BaTiO3 标题中的化学式来自 Scholar 页面图片的替代文本。2025 年 PNAS 的卷期和文章号由展板补齐，其余缺失卷期／文章号未猜测。四篇代表作的 DOI 经期刊或原文记录核对：

- [PNAS 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12403145/)
- [Nature Communications 2024](https://www.nature.com/articles/s41467-024-54631-1)
- [Physical Review Letters 2023](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.131.076801)
- [Nature Communications 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC8831556/)

`publications.json` 是可复用的结构化结果，由 `build.py` 自动生成。网站保留上述 Scholar 快照并包含此后人工新增的期刊论文，不会自动抓取 Scholar。未来新增文章可编辑 TSV 或再次导入列表。

图像用于该课题组主页。没有替用户虚构办公地址、CV 文件、课程、新闻、申请截止日期、通讯作者身份或文章引用指标。

## 研究图轮播

01 部分保留原展板介绍，图片以小尺寸放在文字右侧，通过带轻微立体旋转、滑动、缩放和淡入淡出的动画轮播展示 4 张原海报研究图：溶液中的水与离子、固液界面电双层、电场下的界面体系、电解质微观结构与介电常数。每 6 秒自动切换，可通过箭头或圆点手动切换，也可暂停；鼠标停留、键盘焦点进入、页面隐藏或轮播离开视野时暂停自动切换。系统启用减少动态效果时默认暂停。

Science 新闻链接已在 Publications 中作为 Media coverage 单独列出，位于代表性论文之后。标题、作者 Adrian Cho 与发布日期 28 July 2023 已在用户提供的 Science 页面核对；媒体报道不计入 38 条论文成果。

## 中英文切换

2026-10-10 按用户要求恢复中英文切换。页首按钮在中文与英文之间切换，浏览器会保存选择。导航、研究介绍、导师与团队信息、图片说明、成果类型、筛选与搜索提示同步切换；论文标题、作者与期刊信息保留原文。此前删除的研究概述与人才称号不恢复。
