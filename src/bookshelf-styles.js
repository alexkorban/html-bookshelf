export const sharedStyles = `[data-html-bookshelf] {
  box-sizing: border-box;
  container-type: inline-size;
  display: block;
  inline-size: 100%;
  color: #171717;
}
[data-html-bookshelf] *, [data-html-bookshelf] *::before, [data-html-bookshelf] *::after { box-sizing: border-box; }
[data-html-bookshelf] .hbs-list {
  --hbs-book-gap: 0.2rem;
  --hbs-shelf-thickness: 0.35rem;
  align-items: flex-end;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem var(--hbs-book-gap);
  list-style: none;
  margin: 0;
  padding: 0 0 var(--hbs-shelf-thickness);
  position: relative;
}
[data-html-bookshelf] .hbs-list::after {
  background: #67737b;
  block-size: var(--hbs-shelf-thickness);
  border-radius: 0.1rem;
  bottom: 0;
  box-shadow: 0 0.22rem 0.24rem #0004;
  content: "";
  inline-size: 100%;
  left: 0;
  position: absolute;
}
[data-html-bookshelf].hbs-shelf-wood .hbs-list { --hbs-shelf-thickness: 0.78rem; }
[data-html-bookshelf].hbs-shelf-wood .hbs-list::before { background: linear-gradient(#e1a669, #b56f3d); block-size: 0.12rem; bottom: calc(var(--hbs-shelf-thickness) - 0.12rem); box-shadow: 0 -0.04rem 0.08rem #fff4; content: ""; inline-size: 100%; left: 0; position: absolute; }
[data-html-bookshelf].hbs-shelf-wood .hbs-list::after { background: radial-gradient(ellipse 1.1rem 0.2rem at var(--hbs-wood-knot-one) 57%, #43231755 0 40%, transparent 48%), radial-gradient(ellipse 1.5rem 0.17rem at var(--hbs-wood-knot-two) 36%, #3e201455 0 36%, transparent 48%), repeating-linear-gradient(0deg, #6b351d10 0 0.08rem, transparent 0.08rem 0.31rem), linear-gradient(180deg, #c67b43 0%, #9a552d 22%, #703719 100%); box-shadow: 0 0.34rem 0.72rem #2e170d40; }
[data-html-bookshelf].hbs-shelf-metal .hbs-list::after { background: linear-gradient(#d6dadd, #6c7378 50%, #d6dadd); block-size: 0.35rem; box-shadow: 0 0.15rem 0.18rem #0005; }
[data-html-bookshelf].hbs-shelf-none .hbs-list::after { display: none; }
[data-html-bookshelf] .hbs-book {
  align-items: stretch;
  background: var(--hbs-background);
  --hbs-author-size: 0.7rem;
  --hbs-title-size: 0.8rem;
  --hbs-rendered-height: calc(var(--hbs-spine-height) * (1 + var(--hbs-height-variation)));
  block-size: var(--hbs-rendered-height);
  border: 1px solid #0004;
  box-shadow: inset 0.18rem 0 0 #fff3, inset -0.12rem 0 #0002, 0.12rem 0.12rem 0.18rem #0003;
  color: var(--hbs-foreground);
  container-type: inline-size;
  display: flex;
  flex: var(--hbs-thickness) 1 var(--hbs-min-spine-width);
  font-family: var(--hbs-font);
  justify-content: center;
  max-inline-size: max(var(--hbs-min-spine-width), min(7rem, 22cqi, calc(var(--hbs-rendered-height) * 0.42)));
  min-inline-size: var(--hbs-min-spine-width);
  overflow: hidden;
  position: relative;
  transform-origin: bottom center;
}
[data-html-bookshelf] .hbs-book::before { display: none; }
[data-html-bookshelf] .hbs-book--leaning { align-self: flex-end; margin-inline-start: calc(var(--hbs-rendered-height) * sin(var(--hbs-lean-angle)) - var(--hbs-book-gap)); transform: rotate(calc(-1 * var(--hbs-lean-angle))); transform-origin: bottom left; }
[data-html-bookshelf] .hbs-book-art { inset: 0; overflow: hidden; pointer-events: none; position: absolute; }
[data-html-bookshelf] .hbs-book-link { color: inherit; display: flex; flex: 1; min-inline-size: 0; position: relative; text-decoration: none; z-index: 1; }
[data-html-bookshelf] .hbs-book-content { color: inherit; display: flex; flex: 1; flex-direction: column; justify-content: flex-end; min-block-size: 0; min-inline-size: 0; padding: 0.55rem 0.34rem; position: relative; text-decoration: none; writing-mode: vertical-rl; z-index: 1; }
[data-html-bookshelf] .hbs-title { font-size: var(--hbs-title-size); font-weight: 700; line-height: 1.08; overflow-wrap: normal; white-space: nowrap; }
[data-html-bookshelf] .hbs-author { font-size: var(--hbs-author-size); line-height: 1.15; margin-block-start: 0.45rem; overflow-wrap: anywhere; }
[data-html-bookshelf] .hbs-book-link:focus-visible { outline: 0.2rem solid #fff; outline-offset: -0.35rem; }
[data-html-bookshelf][data-hbs-animation="true"] .hbs-book { animation: hbs-enter 180ms ease-out both; animation-delay: var(--hbs-entrance-delay); transition: scale 140ms ease-out; }
[data-html-bookshelf][data-hbs-animation="true"] .hbs-book:hover, [data-html-bookshelf][data-hbs-animation="true"] .hbs-book:focus-within { scale: 1.06; z-index: 2; }
[data-html-bookshelf][data-hbs-animation="true"] .hbs-book-link { transition: box-shadow 120ms ease-out, transform 120ms ease-out; }
[data-html-bookshelf][data-hbs-animation="true"] .hbs-book-link:hover, [data-html-bookshelf][data-hbs-animation="true"] .hbs-book-link:focus-visible { box-shadow: 0 -0.18rem 0.42rem #0007; transform: translateY(-0.12rem); }
[data-html-bookshelf][data-hbs-animation="true"] .hbs-theme-old-school .hbs-book-link:hover, [data-html-bookshelf][data-hbs-animation="true"] .hbs-theme-old-school .hbs-book-link:focus-visible { transform: none; }
@keyframes hbs-enter { from { opacity: 0; translate: 0 0.4rem; } to { opacity: 1; translate: 0 0; } }
@media (prefers-reduced-motion: reduce) { [data-html-bookshelf] *, [data-html-bookshelf] *::before, [data-html-bookshelf] *::after { animation: none !important; scroll-behavior: auto !important; transition: none !important; } }
[data-html-bookshelf] .hbs-theme-modern { --hbs-foreground: #10233a; --hbs-theme-font: ui-sans-serif, system-ui, sans-serif; border-color: #10233a33; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-0 { --hbs-background: #f4d9b8; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-0 .hbs-book-art { background: radial-gradient(circle at 28% 18%, #e8523f 0 17%, transparent 18%), radial-gradient(circle at 78% 38%, #146e91 0 23%, transparent 24%), radial-gradient(circle at 88% 78%, #efb32d 0 15%, transparent 16%), linear-gradient(145deg, #f7ead1, #e7c99e); }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-0 .hbs-book-content { color: #10233a; text-shadow: 0 0.06rem 0.08rem #fff9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-1 { --hbs-background: #edf1eb; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-1 .hbs-book-art { background: radial-gradient(circle at 78% 17%, #335aa940 0 2%, transparent 2.8%) 0 0 / 0.65rem 0.65rem, radial-gradient(ellipse at 16% 22%, #ef785c99 0 19%, transparent 40%), radial-gradient(ellipse at 84% 44%, #56a99d88 0 20%, transparent 42%), linear-gradient(135deg, #fffdf6, #dbe7e3); }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-1 .hbs-book-content { color: #142b42; text-shadow: 0 0.06rem 0.08rem #fff9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-2 { --hbs-background: #e8e4d8; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-2 .hbs-book-art { background: linear-gradient(105deg, transparent 0 37%, #e94f38 38% 45%, transparent 46%), radial-gradient(circle, #173e7233 0 0.09rem, transparent 0.11rem) 0 0 / 0.42rem 0.42rem, linear-gradient(135deg, #f4f1e5, #ddd5c4); }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-2 .hbs-book-content { color: #152b45; text-shadow: 0 0.06rem 0.08rem #fff9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-3 { --hbs-background: #f5f2ec; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-3 .hbs-book-art { background: radial-gradient(ellipse at 82% 78%, #4e93b966 0 15%, transparent 34%), linear-gradient(90deg, transparent 0 20%, #172d491c 20% 23%, transparent 23% 77%, #dc65441c 77% 80%, transparent 80%), linear-gradient(#fffdf8, #e9e2d8); }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-3 .hbs-book-content { color: #152b45; padding-inline: 0.46rem; text-shadow: 0 0.06rem 0.08rem #fff9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-4 { --hbs-background: #e6edf1; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-4 .hbs-book-art { background: radial-gradient(ellipse at 14% 24%, #653d9e88 0 18%, transparent 40%), radial-gradient(ellipse at 85% 80%, #e6a63188 0 20%, transparent 42%), linear-gradient(115deg, #f9f8f2, #d8e6ed); }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-4 .hbs-book-content { color: #172943; text-shadow: 0 0.06rem 0.08rem #fff9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-5 { --hbs-background: #f0e7d9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-5 .hbs-book-art { background: linear-gradient(28deg, transparent 0 41%, #1b6c7f 42% 49%, transparent 50%), radial-gradient(circle, #cc4e4566 0 0.12rem, transparent 0.14rem) 0 0 / 0.52rem 0.52rem, linear-gradient(#fffaf0, #e7d5bd); }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-5 .hbs-book-content { color: #1b3044; text-shadow: 0 0.06rem 0.08rem #fff9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-6 { --hbs-background: #f5ece0; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-6 .hbs-book-art { background: radial-gradient(circle at 18% 16%, #df5f4f 0 14%, transparent 15%), radial-gradient(circle at 82% 38%, #3e769c 0 16%, transparent 17%), linear-gradient(90deg, transparent 0 49%, #182f4b1a 50% 52%, transparent 53%), linear-gradient(#fffcf5, #e9d9c6); }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-6 .hbs-book-content { color: #192e46; text-shadow: 0 0.06rem 0.08rem #fff9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-7 { --hbs-background: #e7efe9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-7 .hbs-book-art { background: repeating-linear-gradient(0deg, transparent 0 0.48rem, #426d8540 0.5rem 0.54rem), radial-gradient(ellipse at 78% 78%, #cf795c88 0 17%, transparent 36%), linear-gradient(135deg, #fafff8, #d4e4dc); }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-7 .hbs-book-content { color: #183247; text-shadow: 0 0.06rem 0.08rem #fff9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-8 { --hbs-background: #f2e5d5; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-8 .hbs-book-art { background: linear-gradient(135deg, #fff7ea, #e6c8aa); }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-8 .hbs-book-content { color: #253044; text-shadow: 0 0.06rem 0.08rem #fff9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-9 { --hbs-background: #dcebef; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-9 .hbs-book-art { background: linear-gradient(90deg, #d6e8ef, #f4f7f3 48%, #bfd8df); }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-9 .hbs-book-content { color: #183246; text-shadow: 0 0.06rem 0.08rem #fff9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-10 { --hbs-background: #f1e2e8; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-10 .hbs-book-art { background: linear-gradient(155deg, #fff8f8, #e5c2d0 58%, #f1ddd5); }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-10 .hbs-book-content { color: #3b2436; text-shadow: 0 0.06rem 0.08rem #fff9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-11 { --hbs-background: #e5ead8; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-11 .hbs-book-art { background: linear-gradient(120deg, #f6f3dc, #d4dfcb); }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-11 .hbs-book-content { color: #263827; text-shadow: 0 0.06rem 0.08rem #fff9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-12 { --hbs-background: #eee3ce; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-12 .hbs-book-art { background: #eee3ce; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-12 .hbs-book-content { color: #3c2e22; text-shadow: 0 0.06rem 0.08rem #fff9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-13 { --hbs-background: #e3e3ef; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-13 .hbs-book-art { background: linear-gradient(145deg, #f7f5ff, #cacbe2); }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-13 .hbs-book-content { color: #282c4b; text-shadow: 0 0.06rem 0.08rem #fff9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-14 { --hbs-background: #dbe9e5; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-14 .hbs-book-art { background: #dbe9e5; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-14 .hbs-book-content { color: #173b3a; text-shadow: 0 0.06rem 0.08rem #fff9; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-15 { --hbs-background: #f0ddd3; }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-15 .hbs-book-art { background: linear-gradient(100deg, #f7e8dd, #ddb9ab 52%, #f2d9c9); }
[data-html-bookshelf] .hbs-theme-modern.hbs-modern-15 .hbs-book-content { color: #42291f; text-shadow: 0 0.06rem 0.08rem #fff9; }
[data-html-bookshelf] .hbs-theme-academic { --hbs-foreground: #fffaf0; --hbs-theme-font: ui-serif, Georgia, Cambria, "Times New Roman", serif; border-color: #15151566; box-shadow: inset 0.16rem 0 #fff2, inset -0.16rem 0 #0004, 0.12rem 0.12rem 0.18rem #0004; }
[data-html-bookshelf] .hbs-theme-academic::before { background: var(--hbs-academic-rule); block-size: 0.16rem; box-shadow: 0 0.42rem 0 var(--hbs-academic-rule); content: ""; display: block; inset: 0.65rem 0.12rem auto; position: absolute; }
[data-html-bookshelf] .hbs-theme-academic .hbs-title-zone, [data-html-bookshelf] .hbs-theme-old-school .hbs-title-zone { align-self: stretch; justify-content: center; margin: 2rem 0.3rem 1rem; padding: 0.34rem 0.2rem; }
[data-html-bookshelf] .hbs-theme-academic .hbs-title-zone { text-shadow: 0.05rem 0.05rem #0008; }
[data-html-bookshelf] .hbs-theme-academic.hbs-variant-0 { --hbs-academic-rule: #dec783; --hbs-background: linear-gradient(90deg, #0a1a32, #183861 50%, #0b1d38); }
[data-html-bookshelf] .hbs-theme-academic.hbs-variant-0 .hbs-book-art { background: linear-gradient(90deg, transparent, #f4e0a51c, transparent); inset: 1.4rem 0.2rem auto; block-size: 0.45rem; }
[data-html-bookshelf] .hbs-theme-academic.hbs-variant-1 { --hbs-academic-rule: #d6c78d; --hbs-background: linear-gradient(90deg, #102d24, #2d5d45 50%, #143329); }
[data-html-bookshelf] .hbs-theme-academic.hbs-variant-1 .hbs-book-art { border-block: 0.08rem solid #e7d89a88; inset: 1.55rem 0.22rem auto; block-size: 0.56rem; }
[data-html-bookshelf] .hbs-theme-academic.hbs-variant-2 { --hbs-academic-rule: #d8c6e0; --hbs-background: linear-gradient(90deg, #291c35, #563960 50%, #2f203e); }
[data-html-bookshelf] .hbs-theme-academic.hbs-variant-2 .hbs-book-art { background: radial-gradient(circle at 50% 50%, #e6d8ef66 0 0.09rem, transparent 0.11rem) 0 0 / 0.38rem 0.38rem; inset: 1.45rem 0.2rem auto; block-size: 0.56rem; }
[data-html-bookshelf] .hbs-theme-academic.hbs-variant-3 { --hbs-academic-rule: #efd09a; --hbs-background: linear-gradient(90deg, #54221e, #91483b 50%, #5d2821); }
[data-html-bookshelf] .hbs-theme-academic.hbs-variant-3 .hbs-book-art { background: linear-gradient(90deg, transparent, #f5d6a744, transparent); inset: 1.45rem 0.2rem auto; block-size: 0.62rem; }
[data-html-bookshelf] .hbs-theme-old-school { --hbs-foreground: #fff4dc; --hbs-theme-font: "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif; border-color: #1d0b0788; box-shadow: inset 0.26rem 0 0.3rem #0008, inset -0.22rem 0 0.28rem #0008, inset 0 0 1.1rem #f6d48622, 0.12rem 0.12rem 0.22rem #0005; }
[data-html-bookshelf] .hbs-theme-old-school::before { background: linear-gradient(#f7d778, #a86e20, #f7d778); block-size: 0.2rem; box-shadow: 0 0.38rem 0 #d5a845, 0 0.48rem 0 #4d210f, 0 0.86rem 0 #d5a845, 0 0.96rem 0 #4d210f; content: ""; display: block; inset: 0.65rem 0.16rem auto; position: absolute; }
[data-html-bookshelf] .hbs-theme-old-school .hbs-title-zone { margin-bottom: 3rem; }
[data-html-bookshelf] .hbs-theme-old-school .hbs-book-art { block-size: 2.4rem; inset: auto 0 0.35rem; }
[data-html-bookshelf] .hbs-theme-old-school .hbs-book-content { text-shadow: 0.05rem 0.05rem #210b05; }
[data-html-bookshelf] .hbs-theme-old-school.hbs-variant-0 { --hbs-background: radial-gradient(ellipse at 50% 50%, #a04a35 0 35%, #681d1a 74%, #2b090b); }
[data-html-bookshelf] .hbs-theme-old-school.hbs-variant-0 .hbs-book-art { background: radial-gradient(circle at 50% 50%, #f1d379 0 0.1rem, transparent 0.11rem), repeating-conic-gradient(from 0deg at 50% 50%, #e2bd5c 0deg 7deg, transparent 7deg 15deg); background-position: 50% 1.5rem, 50% 1.5rem; background-repeat: no-repeat; background-size: 1.1rem 1.1rem, 1.1rem 1.1rem; }
[data-html-bookshelf] .hbs-theme-old-school.hbs-variant-1 { --hbs-background: radial-gradient(ellipse at 50% 50%, #32644d 0 35%, #173b31 73%, #09231d); }
[data-html-bookshelf] .hbs-theme-old-school.hbs-variant-1 .hbs-book-art { background: radial-gradient(ellipse 0.4rem 0.1rem at 50% 50%, #f2d57a 0 35%, transparent 38%), linear-gradient(45deg, transparent 46%, #dcb85a 47% 53%, transparent 54%), linear-gradient(-45deg, transparent 46%, #dcb85a 47% 53%, transparent 54%); background-position: 50% 1.5rem, 50% 1.1rem, 50% 1.1rem; background-repeat: no-repeat; background-size: 0.8rem 0.3rem, 0.7rem 0.7rem, 0.7rem 0.7rem; }
[data-html-bookshelf] .hbs-theme-old-school.hbs-variant-2 { --hbs-background: radial-gradient(ellipse at 50% 50%, #2b4b81 0 33%, #102952 72%, #081633); }
[data-html-bookshelf] .hbs-theme-old-school.hbs-variant-2 .hbs-book-art { background: radial-gradient(circle at 50% 50%, #efcf71 0 0.09rem, transparent 0.1rem), linear-gradient(45deg, transparent 45%, #d8af50 46% 54%, transparent 55%), linear-gradient(-45deg, transparent 45%, #d8af50 46% 54%, transparent 55%); background-position: 50% 1.4rem, 50% 1.05rem, 50% 1.05rem; background-repeat: no-repeat; background-size: 0.2rem 0.2rem, 0.7rem 0.7rem, 0.7rem 0.7rem; }
[data-html-bookshelf] .hbs-theme-old-school.hbs-variant-3 { --hbs-background: radial-gradient(ellipse at 50% 50%, #8b5635 0 34%, #56311d 72%, #291309); }
[data-html-bookshelf] .hbs-theme-old-school.hbs-variant-3 .hbs-book-art { background: radial-gradient(circle at 50% 50%, #edcf76 0 0.12rem, #5d3015 0.13rem 0.2rem, transparent 0.21rem), repeating-conic-gradient(from 0deg at 50% 50%, #d6ad52 0deg 5deg, transparent 5deg 15deg); background-position: 50% 1.48rem, 50% 1.48rem; background-repeat: no-repeat; background-size: 0.9rem 0.9rem, 0.9rem 0.9rem; }
@container (inline-size < 2.25rem) { [data-html-bookshelf] .hbs-theme-academic .hbs-book-content, [data-html-bookshelf] .hbs-theme-old-school .hbs-book-content { --hbs-author-size: 0.65rem; --hbs-title-size: 0.7rem; } }
@container (inline-size < 2.75rem) { [data-html-bookshelf] .hbs-theme-academic .hbs-author, [data-html-bookshelf] .hbs-theme-old-school .hbs-author { margin-block-start: 0.2rem; } }
@container (inline-size >= 3.75rem) { [data-html-bookshelf] .hbs-book.hbs-text-compact .hbs-book-content { --hbs-author-size: clamp(0.55rem, 9cqi, 0.7rem); --hbs-title-size: clamp(0.55rem, 10cqi, 0.8rem); overflow-wrap: anywhere; writing-mode: horizontal-tb; } [data-html-bookshelf] .hbs-book.hbs-text-compact .hbs-title { overflow-wrap: anywhere; white-space: normal; } }
@container (inline-size >= 5rem) { [data-html-bookshelf] .hbs-book.hbs-text-regular .hbs-book-content { --hbs-author-size: clamp(0.55rem, 9cqi, 0.7rem); --hbs-title-size: clamp(0.55rem, 10cqi, 0.8rem); overflow-wrap: anywhere; writing-mode: horizontal-tb; } [data-html-bookshelf] .hbs-book.hbs-text-regular .hbs-title { overflow-wrap: anywhere; white-space: normal; } }
@container (inline-size >= 6.25rem) { [data-html-bookshelf] .hbs-book.hbs-text-wide .hbs-book-content { --hbs-author-size: clamp(0.55rem, 9cqi, 0.7rem); --hbs-title-size: clamp(0.55rem, 10cqi, 0.8rem); overflow-wrap: anywhere; writing-mode: horizontal-tb; } [data-html-bookshelf] .hbs-book.hbs-text-wide .hbs-title { overflow-wrap: anywhere; white-space: normal; } }
[data-html-bookshelf][data-hbs-layout="stack"] .hbs-list { align-items: stretch; display: block; padding: 0; }
[data-html-bookshelf][data-hbs-layout="stack"] .hbs-list::after { display: none; }
[data-html-bookshelf][data-hbs-layout="stack"] .hbs-book { block-size: max(30px, calc(0.75rem + (0.75rem * var(--hbs-thickness)))); box-shadow: inset 0.18rem 0 0.22rem #fff5, inset -0.34rem 0 0.4rem #0005, 0.2rem 0.24rem 0.42rem #0004; inline-size: calc(100% - 0.75rem); margin-block-end: -0.2rem; margin-inline: auto; max-inline-size: none; min-inline-size: 0; transform: perspective(40rem) translateX(calc(var(--hbs-stack-shift) * 0.6rem)) rotateY(calc(2deg + var(--hbs-stack-yaw) * 1deg)); transform-origin: center; }
[data-html-bookshelf][data-hbs-layout="stack"] .hbs-book--leaning { margin-inline: auto; transform: perspective(40rem) translateX(calc(var(--hbs-stack-shift) * 0.6rem)) rotateY(calc(2deg + var(--hbs-stack-yaw) * 1deg)); transform-origin: center; }
[data-html-bookshelf][data-hbs-layout="stack"] .hbs-book::before { display: none; }
[data-html-bookshelf][data-hbs-layout="stack"] .hbs-book::after { background: linear-gradient(90deg, #fff7, #fff0); content: ""; inset: 0 auto 0 0.24rem; position: absolute; width: 0.16rem; }
[data-html-bookshelf][data-hbs-layout="stack"] .hbs-theme-old-school::before { background: linear-gradient(90deg, #f7d778, #a86e20, #f7d778); block-size: auto; box-shadow: -0.36rem 0 0 #d5a845, -0.46rem 0 0 #4d210f, -0.82rem 0 0 #d5a845, -0.92rem 0 0 #4d210f; display: block; inline-size: 0.18rem; inset: 0.16rem 0.7rem 0.16rem auto; z-index: 1; }
[data-html-bookshelf][data-hbs-layout="stack"] .hbs-theme-old-school .hbs-book-art { block-size: auto; inset: 0; background-position: calc(100% - 3rem) 50%; }
[data-html-bookshelf][data-hbs-layout="stack"] .hbs-theme-old-school .hbs-book-content { padding-inline-end: 5rem; }
[data-html-bookshelf][data-hbs-layout="stack"] .hbs-book-content { align-items: center; flex-direction: row; justify-content: flex-start; margin: 0; padding: 0.2rem 0.6rem; writing-mode: horizontal-tb; }
[data-html-bookshelf][data-hbs-layout="stack"] .hbs-title { font-size: clamp(0.55rem, 4.5cqi, 0.8rem); }
[data-html-bookshelf][data-hbs-layout="stack"] .hbs-author { font-size: clamp(0.55rem, 4cqi, 0.7rem); margin-block-start: 0; margin-inline-start: 0.6rem; }
`

/** @param {string} instance @param {string} stackThreshold */
export const responsiveStyles = (instance, stackThreshold) => `@container hbs-${instance} (inline-size < ${stackThreshold}) {
  [data-html-bookshelf][data-hbs-instance="${instance}"] .hbs-list { align-items: stretch; display: block; padding: 0; }
  [data-html-bookshelf][data-hbs-instance="${instance}"] .hbs-list::after { display: none; }
  [data-html-bookshelf][data-hbs-instance="${instance}"] .hbs-book { block-size: max(30px, calc(0.75rem + (0.75rem * var(--hbs-thickness)))); box-shadow: inset 0.18rem 0 0.22rem #fff5, inset -0.34rem 0 0.4rem #0005, 0.2rem 0.24rem 0.42rem #0004; inline-size: calc(100% - 0.75rem); margin-block-end: -0.2rem; margin-inline: auto; max-inline-size: none; min-inline-size: 0; transform: perspective(40rem) translateX(calc(var(--hbs-stack-shift) * 0.6rem)) rotateY(calc(2deg + var(--hbs-stack-yaw) * 1deg)); transform-origin: center; }
  [data-html-bookshelf][data-hbs-instance="${instance}"] .hbs-book--leaning { margin-inline: auto; transform: perspective(40rem) translateX(calc(var(--hbs-stack-shift) * 0.6rem)) rotateY(calc(2deg + var(--hbs-stack-yaw) * 1deg)); transform-origin: center; }
  [data-html-bookshelf][data-hbs-instance="${instance}"] .hbs-book::before { display: none; }
  [data-html-bookshelf][data-hbs-instance="${instance}"] .hbs-book::after { background: linear-gradient(90deg, #fff7, #fff0); content: ""; inset: 0 auto 0 0.24rem; position: absolute; width: 0.16rem; }
  [data-html-bookshelf][data-hbs-instance="${instance}"] .hbs-theme-old-school::before { background: linear-gradient(90deg, #f7d778, #a86e20, #f7d778); block-size: auto; box-shadow: -0.36rem 0 0 #d5a845, -0.46rem 0 0 #4d210f, -0.82rem 0 0 #d5a845, -0.92rem 0 0 #4d210f; display: block; inline-size: 0.18rem; inset: 0.16rem 0.7rem 0.16rem auto; z-index: 1; }
  [data-html-bookshelf][data-hbs-instance="${instance}"] .hbs-theme-old-school .hbs-book-art { block-size: auto; inset: 0; background-position: calc(100% - 3rem) 50%; }
  [data-html-bookshelf][data-hbs-instance="${instance}"] .hbs-theme-old-school .hbs-book-content { padding-inline-end: 5rem; }
  [data-html-bookshelf][data-hbs-instance="${instance}"] .hbs-book-content { align-items: center; flex-direction: row; justify-content: flex-start; margin: 0; padding: 0.2rem 0.6rem; writing-mode: horizontal-tb; }
  [data-html-bookshelf][data-hbs-instance="${instance}"] .hbs-title { font-size: clamp(0.55rem, 4.5cqi, 0.8rem); }
  [data-html-bookshelf][data-hbs-instance="${instance}"] .hbs-author { font-size: clamp(0.55rem, 4cqi, 0.7rem); margin-block-start: 0; margin-inline-start: 0.6rem; }
}`
