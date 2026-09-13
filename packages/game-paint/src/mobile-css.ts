/** Chapter one's touch layout. World coordinates and task state stay unchanged. */
export const PAINT_MOBILE_CSS = `
.pb-game-stage{position:relative}
.pb-game-host{position:absolute;inset:0}
.pb-game-shell[data-mobile="true"]{
  position:fixed!important;inset:0;top:var(--pb-viewport-top,0px);
  width:100%;max-width:none!important;height:var(--pb-viewport-height,100dvh);
  box-sizing:border-box;z-index:50;display:flex;flex-direction:column;gap:6px;
  padding:max(6px,env(safe-area-inset-top)) max(8px,env(safe-area-inset-right)) max(8px,env(safe-area-inset-bottom)) max(8px,env(safe-area-inset-left));
  background:#f3ead6;overflow:hidden;
}
.pb-game-shell[data-mobile="true"] .pb-game-hud{flex:0 0 auto;gap:6px!important;padding:0!important}
.pb-game-shell[data-mobile="true"] .pb-game-hud>span:first-child{font-size:13px!important;max-width:110px}
.pb-game-shell[data-mobile="true"] .pb-game-hud>span:last-child{gap:4px!important}
.pb-game-shell[data-mobile="true"] .pb-hud-chip{font-size:12px;padding:4px 7px}
.pb-game-shell[data-mobile="true"] .pb-game-hud button{min-height:44px}
.pb-game-shell[data-mobile="true"] .pb-game-stage{flex:1 1 0;min-height:0;aspect-ratio:auto}
.pb-game-shell[data-mobile="true"] .pb-touch-pad{flex:0 0 auto;margin-top:0!important}
.pb-game-shell[data-mobile="true"] .pb-keyboard-help{display:none}
.pb-game-shell[data-mobile="true"] .pb-veil{
  position:fixed!important;inset:0!important;top:var(--pb-viewport-top,0px)!important;
  height:var(--pb-viewport-height,100dvh);box-sizing:border-box;z-index:80;
  padding:max(12px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left))!important;
  align-items:center!important;justify-content:center!important;
}
.pb-game-shell[data-mobile="true"] .pb-card{
  width:min(680px,100%)!important;max-width:100%!important;max-height:100%;
  box-sizing:border-box;transform:none!important;margin:0!important;padding:14px 16px;
}
.pb-game-shell[data-mobile="true"] .pb-card-scroll{min-height:0;overscroll-behavior:contain}
.pb-game-shell[data-mobile="true"] .pb-card input{font-size: max(16px,1em)}
.pb-game-shell[data-mobile="true"] .pb-task-picture{max-width:100%}
.pb-game-shell[data-mobile="true"] .pb-task-content{min-width:0}
@media(max-width:380px){
  .pb-game-shell[data-mobile="true"] .pb-touch-pad>div{gap:6px!important}
  .pb-game-shell[data-mobile="true"] .pb-touch-pad button{width:52px!important}
  .pb-game-shell[data-mobile="true"] .pb-touch-pad button[aria-label="springen"]{width:64px!important}
}
@media(max-height:600px) and (orientation:landscape){
  .pb-game-shell[data-mobile="true"] .pb-card{width:min(980px,100%)!important;padding:10px 14px}
  .pb-game-shell[data-mobile="true"] .pb-card-scroll:has(>.pb-task-picture){display:grid;grid-template-columns:minmax(140px,1fr) minmax(0,2fr);gap:14px;align-items:start}
  .pb-game-shell[data-mobile="true"] .pb-task-picture{position:sticky;top:0}
  .pb-game-shell[data-mobile="true"] .pb-task-content>.pb-cap{margin-top:0}
  .pb-game-shell[data-mobile="true"] .pb-task-content>button:last-child{margin-top:8px!important}
}
@media(max-height:360px) and (orientation:landscape){
  .pb-game-shell[data-mobile="true"] .pb-task-content button{min-height:44px;padding:6px 10px!important}
}
`;
