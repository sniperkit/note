(function(window){var svgSprite='<svg><symbol id="icon-plus" viewBox="0 0 1024 1024"><path d="M512 85.333333q17.664 0 30.165333 12.501333t12.501333 30.165333l0 341.333333 341.333333 0q17.664 0 30.165333 12.501333t12.501333 30.165333-12.501333 30.165333-30.165333 12.501333l-341.333333 0 0 341.333333q0 17.664-12.501333 30.165333t-30.165333 12.501333-30.165333-12.501333-12.501333-30.165333l0-341.333333-341.333333 0q-17.664 0-30.165333-12.501333t-12.501333-30.165333 12.501333-30.165333 30.165333-12.501333l341.333333 0 0-341.333333q0-17.664 12.501333-30.165333t30.165333-12.501333z"  ></path></symbol><symbol id="icon-edit" viewBox="0 0 1024 1024"><path d="M507.465143 676.571429l66.267429-66.267429-86.820571-86.820571-66.267429 66.267429 0 32.036571 54.857143 0 0 54.857143 32.036571 0zM758.857143 265.142857q-9.142857-9.142857-18.870857 0.585143l-199.972571 199.972571q-9.728 9.728-0.585143 18.870857t18.870857-0.585143l199.972571-199.972571q9.728-9.728 0.585143-18.870857zM804.571429 604.598857l0 108.544q0 68.022857-48.274286 116.297143t-116.297143 48.274286l-475.428571 0q-68.022857 0-116.297143-48.274286t-48.274286-116.297143l0-475.428571q0-68.022857 48.274286-116.297143t116.297143-48.274286l475.428571 0q35.986286 0 66.852571 14.262857 8.557714 4.022857 10.313143 13.165714 1.682286 9.728-5.12 16.603429l-28.013714 28.013714q-7.972571 7.972571-18.285714 4.534857-13.165714-3.437714-25.746286-3.437714l-475.428571 0q-37.741714 0-64.585143 26.843429t-26.843429 64.585143l0 475.428571q0 37.741714 26.843429 64.585143t64.585143 26.843429l475.428571 0q37.741714 0 64.585143-26.843429t26.843429-64.585143l0-71.972571q0-7.460571 5.12-12.580571l36.571429-36.571429q8.557714-8.557714 19.968-4.022857t11.410286 16.603429zM749.714286 182.857143l164.571429 164.571429-384 384-164.571429 0 0-164.571429zM1003.446857 258.267429l-52.589714 52.589714-164.571429-164.571429 52.589714-52.589714q16.018286-16.018286 38.838857-16.018286t38.838857 16.018286l86.820571 86.820571q16.018286 16.018286 16.018286 38.838857t-16.018286 38.838857z"  ></path></symbol><symbol id="icon-minus" viewBox="0 0 1024 1024"><path d="M914.285714 420.571429l0 109.714286q0 22.820571-16.018286 38.838857t-38.838857 16.018286l-694.857143 0q-22.820571 0-38.838857-16.018286t-16.018286-38.838857l0-109.714286q0-22.820571 16.018286-38.838857t38.838857-16.018286l694.857143 0q22.820571 0 38.838857 16.018286t16.018286 38.838857z"  ></path></symbol><symbol id="icon-close" viewBox="0 0 1024 1024"><path d="M887.2 774.2 624.8 510.8l263-260c10.8-10.8 10.8-28.4 0-39.2l-74.8-75.2c-5.2-5.2-12.2-8-19.6-8-7.4 0-14.4 3-19.6 8L512 395.6 249.8 136.6c-5.2-5.2-12.2-8-19.6-8-7.4 0-14.4 3-19.6 8L136 211.8c-10.8 10.8-10.8 28.4 0 39.2l263 260L136.8 774.2c-5.2 5.2-8.2 12.2-8.2 19.6 0 7.4 2.8 14.4 8.2 19.6l74.8 75.2c5.4 5.4 12.4 8.2 19.6 8.2 7 0 14.2-2.6 19.6-8.2L512 626.2l261.4 262.2c5.4 5.4 12.4 8.2 19.6 8.2 7 0 14.2-2.6 19.6-8.2l74.8-75.2c5.2-5.2 8.2-12.2 8.2-19.6C895.4 786.4 892.4 779.4 887.2 774.2z"  ></path></symbol><symbol id="icon-delete" viewBox="0 0 1024 1024"><path d="M461.448162 755.577574l0-318.043566c0-25.368784-20.558222-45.936215-45.936215-45.935192-25.367761 0-45.925982 20.568455-45.925982 45.936215l0 318.043566c0 12.67774 5.136997 24.170492 13.446243 32.478715 8.319479 8.319479 19.800975 13.455453 32.479739 13.455453C440.889941 801.51379 461.448162 780.945335 461.448162 755.577574z"  ></path><path d="M861.783966 395.187551c-25.367761 0-45.933145 20.565385-45.933145 45.933145l0 409.05028L238.550583 850.170976 238.550583 441.119673c0-25.367761-20.565385-45.933145-45.934169-45.933145-25.367761 0-45.933145 20.565385-45.933145 45.933145l0 454.147384c0 25.162076 20.233833 45.586245 45.316092 45.916772 3.478218 0.554632 7.067976 0.854461 10.744715 0.854461l647.170562 0c3.702322 0 7.315616-0.302899 10.818393-0.865717 0.350994 0.008186 0.698918 0.025583 1.048889 0.025583 25.368784 0 45.935192-20.564361 45.935192-45.933145L907.717112 441.119673C907.718135 415.751912 887.15275 395.187551 861.783966 395.187551z"  ></path><path d="M684.412256 768.138658 684.412256 450.090998c0-25.367761-20.565385-45.933145-45.934169-45.933145-25.367761 0-45.933145 20.565385-45.933145 45.933145l0 318.04766c0 25.368784 20.565385 45.934169 45.933145 45.934169C663.847895 814.071803 684.412256 793.507442 684.412256 768.138658z"  ></path><path d="M925.266813 211.892945 809.48688 211.892945 809.48688 91.761913c0-25.367761-20.558222-45.937239-45.937239-45.936215-1.967818 0-3.901867 0.138146-5.805216 0.378623-0.045025 0-0.090051-0.004093-0.135076-0.004093L288.531927 46.200228c-1.89414-0.237407-3.818979-0.37453-5.777587-0.37453-25.367761 0-45.925982 20.568455-45.925982 45.936215l0 120.131031L125.241934 211.892945c-25.367761 0-45.933145 20.565385-45.933145 45.934169s20.565385 45.932122 45.933145 45.932122l800.025902 0c25.368784 0 45.934169-20.564361 45.934169-45.932122C971.199958 232.458329 950.635597 211.892945 925.266813 211.892945zM717.624682 211.892945 328.691579 211.892945l0-73.825402L717.624682 138.067542 717.624682 211.892945z"  ></path></symbol><symbol id="icon-home" viewBox="0 0 1025 1024"><path d="M1005.477018 396.96l-378.208-378.176c-14.432-14.496-33.792-20.096-52.736-18.528l-124.832 0c-18.944-1.568-38.304 4.032-52.736 18.528l-76.8 76.8 0-95.328-191.936 0 0 287.264-109.472 109.44c-14.496 14.496-20.064 33.824-18.496 52.736l0 126.4c0 35.328 28.608 64 63.968 64l63.968 0 0 319.904c0 35.328 28.608 64 64 64l639.84 0c35.36 0 64-28.64 64-64l0-319.904 63.968 0c35.36 0 64-28.64 64-64l0-126.4c1.568-18.912-4-38.24-18.496-52.736zM896.005018 512.128l-127.968 0 0 383.904-127.968 0 0-255.936-255.936 0 0 255.936-127.968 0 0-383.904-127.968 0 0-35.488 348.416-348.416 70.976 0 348.416 348.416 0 35.488z"  ></path></symbol><symbol id="icon-refresh" viewBox="0 0 1024 1024"><path d="M455.850667 796.785778h-46.762667a284.785778 284.785778 0 0 1-238.193778-280.689778c0-47.274667 12.117333-91.534222 32.654222-130.787556l34.872889 48.355556a51.768889 51.768889 0 0 0 91.818667-16.440889l66.104889-237.738667a51.768889 51.768889 0 0 0-49.891556-65.649777l-237.454222 0.341333A51.768889 51.768889 0 0 0 67.128889 196.266667l64.170667 88.974222a396.117333 396.117333 0 0 0-74.069334 230.912 398.222222 398.222222 0 0 0 336.668445 393.500444c5.176889 0.796444 10.24 0.568889 15.189333-0.056889v0.682667h46.762667A56.149333 56.149333 0 0 0 512 854.129778v-1.137778a56.149333 56.149333 0 0 0-56.149333-56.149333zM956.871111 827.790222l-64.227555-88.974222a395.719111 395.719111 0 0 0 74.069333-230.912 398.279111 398.279111 0 0 0-336.668445-393.557333 54.328889 54.328889 0 0 0-15.189333 0.056889v-0.739556h-46.762667A56.092444 56.092444 0 0 0 512 169.813333v1.137778c0 31.061333 25.144889 56.206222 56.092444 56.206222h46.762667a284.785778 284.785778 0 0 1 238.193778 280.689778c0 47.274667-12.117333 91.534222-32.597333 130.787556l-34.929778-48.355556a51.712 51.712 0 0 0-91.761778 16.440889l-66.161778 237.738667a51.768889 51.768889 0 0 0 49.948445 65.649777l237.454222-0.341333a51.768889 51.768889 0 0 0 41.870222-82.090667z" fill="" ></path></symbol><symbol id="icon-folder" viewBox="0 0 1024 1024"><path d="M832 1024H192a192 192 0 0 1-192-192V192a192 192 0 0 1 192-192h256c83.456 0 153.792 53.632 180.224 128H832c105.984 0 192 85.952 192 192v512c0 106.048-86.016 192-192 192z m64-704c0-35.392-28.608-64-64-64H512V192a64 64 0 0 0-64-64H192a64 64 0 0 0-64 64v640a64 64 0 0 0 64 64h640c35.392 0 64-28.608 64-64V320z" fill="" ></path></symbol><symbol id="icon-file" viewBox="0 0 1024 1024"><path d="M938.666667 298.666667v597.333333c0 70.688-57.312 128-128 128H213.333333c-70.688 0-128-57.312-128-128V128C85.333333 57.312 142.645333 0 213.333333 0h426.666667l298.666667 298.666667z m-298.666667 0h178.005333L640 120.672V298.666667z m213.333333 597.333333V384H554.666667V85.333333H213.333333a42.592 42.592 0 0 0-30.176 12.490667A42.592 42.592 0 0 0 170.666667 128v768c0 15.370667 7.829333 25.504 12.490666 30.165333A42.474667 42.474667 0 0 0 213.333333 938.666667h597.333334c15.370667 0 25.504-7.829333 30.165333-12.501334S853.333333 911.370667 853.333333 896z"  ></path></symbol><symbol id="icon-open" viewBox="0 0 1024 1024"><path d="M938.666667 512a42.666667 42.666667 0 0 0-42.666667 42.666667v298.666666c0 23.573333-19.093333 42.666667-42.666667 42.666667H170.666667c-23.573333 0-42.666667-19.093333-42.666667-42.666667V170.666667c0-23.573333 19.093333-42.666667 42.666667-42.666667h298.666666a42.666667 42.666667 0 0 0 0-85.333333H170.666667C99.978667 42.666667 42.666667 99.978667 42.666667 170.666667v682.666666c0 70.688 57.312 128 128 128h682.666666c70.688 0 128-57.312 128-128V554.666667a42.666667 42.666667 0 0 0-42.666666-42.666667z m42.666666-426.666667v256a42.666667 42.666667 0 0 1-85.333333 0V188.330667l-349.557333 349.546666a42.666667 42.666667 0 0 1-60.32-60.330666L835.658667 128H682.666667a42.666667 42.666667 0 0 1 0-85.333333h256a42.666667 42.666667 0 0 1 42.666666 42.666666z"  ></path></symbol></svg>';var script=function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}();var shouldInjectCss=script.getAttribute("data-injectcss");var ready=function(fn){if(document.addEventListener){if(~["complete","loaded","interactive"].indexOf(document.readyState)){setTimeout(fn,0)}else{var loadFn=function(){document.removeEventListener("DOMContentLoaded",loadFn,false);fn()};document.addEventListener("DOMContentLoaded",loadFn,false)}}else if(document.attachEvent){IEContentLoaded(window,fn)}function IEContentLoaded(w,fn){var d=w.document,done=false,init=function(){if(!done){done=true;fn()}};var polling=function(){try{d.documentElement.doScroll("left")}catch(e){setTimeout(polling,50);return}init()};polling();d.onreadystatechange=function(){if(d.readyState=="complete"){d.onreadystatechange=null;init()}}}};var before=function(el,target){target.parentNode.insertBefore(el,target)};var prepend=function(el,target){if(target.firstChild){before(el,target.firstChild)}else{target.appendChild(el)}};function appendSvg(){var div,svg;div=document.createElement("div");div.innerHTML=svgSprite;svgSprite=null;svg=div.getElementsByTagName("svg")[0];if(svg){svg.setAttribute("aria-hidden","true");svg.style.position="absolute";svg.style.width=0;svg.style.height=0;svg.style.overflow="hidden";prepend(svg,document.body)}}if(shouldInjectCss&&!window.__iconfont__svg__cssinject__){window.__iconfont__svg__cssinject__=true;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(e){console&&console.log(e)}}ready(appendSvg)})(window)