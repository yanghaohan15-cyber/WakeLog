# 雨夜街角

可拖拽、旋转、缩放的日式雨夜便利店街角微缩模型。三渲二，没有界面。拖动旋转，滚轮缩放。模型会从底座往上自行组装。

## 场景代码

都在 `src/components/diorama/`：

| 文件 | 内容 |
| --- | --- |
| `Diorama.tsx` | 场景、灯光、轨道视角 |
| `store.tsx` | 便利店外壳和能透过玻璃看到的店内 |
| `ground.tsx` | 正方形底座、湿路面、斑马线 |
| `props.tsx` | 贩卖机、自行车、雨伞、路灯、电线杆 |
| `rain.tsx` | 雨丝 |
| `assemble.tsx` | 从地面往上组装的入场动画 |
| `textures.tsx` | 日文招牌 |
| `materials.ts` / `primitives.tsx` | 卡通材质和基础形体 |

页面入口是 `src/routes/index.tsx`。

## 本地

```bash
npm install
npm run dev
```
