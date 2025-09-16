const Exclamation = `<svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>`;

const Home = `<svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>`;

const About = `<svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M12 19.2c-2.5 0-4.71-1.28-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.23 7.23 0 0 1-6 3.2M12 5a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-3A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10c0-5.53-4.5-10-10-10"
              />
            </svg>`;

const Other = `<svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 5h13" />
              <path d="M4 10h10" />
              <path d="M4 15h16" />
              <path d="M4 20h13" />
            </svg>`;

const TreeHollow = `<svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>`;

const MessageBoard = `<svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>`;

const FriendshipLinks = `<svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>`;

const Music = `<svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>`;

const PhotoAlbum = `<svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>`;

const FullScreen = `<svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
          </svg>`;

const NonFullScreen = `<svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M20 9V6.616q0-.231-.192-.424T19.385 6H17V5h2.385q.69 0 1.152.463T21 6.616V9zM3 9V6.616q0-.691.463-1.153T4.615 5H7v1H4.616q-.231 0-.424.192T4 6.616V9zm14 10v-1h2.385q.23 0 .423-.192t.192-.424V15h1v2.385q0 .69-.462 1.152T19.385 19zM4.615 19q-.69 0-1.153-.462T3 17.384V15h1v2.385q0 .23.192.423t.423.192H7v1zm2.231-3.846V8.846h10.308v6.308zm1-1h8.308V9.846H7.846zm0 0V9.846z"
            />
          </svg>`;

const Arrow = `<svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>`;

const Refresh = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" >
              <rect width="7.33" height="7.33" x="1" y="1" fill="currentColor">
                <animate
                  id="svgSpinnersBlocksWave0"
                  attributeName="x"
                  begin="0;svgSpinnersBlocksWave1.end+0.3s"
                  dur="0.9s"
                  values="1;4;1"
                />
                <animate attributeName="y" begin="0;svgSpinnersBlocksWave1.end+0.3s" dur="0.9s" values="1;4;1" />
                <animate
                  attributeName="width"
                  begin="0;svgSpinnersBlocksWave1.end+0.3s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
                <animate
                  attributeName="height"
                  begin="0;svgSpinnersBlocksWave1.end+0.3s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
              </rect>
              <rect width="7.33" height="7.33" x="8.33" y="1" fill="currentColor">
                <animate
                  attributeName="x"
                  begin="svgSpinnersBlocksWave0.begin+0.15s"
                  dur="0.9s"
                  values="8.33;11.33;8.33"
                />
                <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.15s" dur="0.9s" values="1;4;1" />
                <animate
                  attributeName="width"
                  begin="svgSpinnersBlocksWave0.begin+0.15s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
                <animate
                  attributeName="height"
                  begin="svgSpinnersBlocksWave0.begin+0.15s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
              </rect>
              <rect width="7.33" height="7.33" x="1" y="8.33" fill="currentColor">
                <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.15s" dur="0.9s" values="1;4;1" />
                <animate
                  attributeName="y"
                  begin="svgSpinnersBlocksWave0.begin+0.15s"
                  dur="0.9s"
                  values="8.33;11.33;8.33"
                />
                <animate
                  attributeName="width"
                  begin="svgSpinnersBlocksWave0.begin+0.15s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
                <animate
                  attributeName="height"
                  begin="svgSpinnersBlocksWave0.begin+0.15s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
              </rect>
              <rect width="7.33" height="7.33" x="15.66" y="1" fill="currentColor">
                <animate
                  attributeName="x"
                  begin="svgSpinnersBlocksWave0.begin+0.3s"
                  dur="0.9s"
                  values="15.66;18.66;15.66"
                />
                <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.9s" values="1;4;1" />
                <animate
                  attributeName="width"
                  begin="svgSpinnersBlocksWave0.begin+0.3s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
                <animate
                  attributeName="height"
                  begin="svgSpinnersBlocksWave0.begin+0.3s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
              </rect>
              <rect width="7.33" height="7.33" x="8.33" y="8.33" fill="currentColor">
                <animate
                  attributeName="x"
                  begin="svgSpinnersBlocksWave0.begin+0.3s"
                  dur="0.9s"
                  values="8.33;11.33;8.33"
                />
                <animate
                  attributeName="y"
                  begin="svgSpinnersBlocksWave0.begin+0.3s"
                  dur="0.9s"
                  values="8.33;11.33;8.33"
                />
                <animate
                  attributeName="width"
                  begin="svgSpinnersBlocksWave0.begin+0.3s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
                <animate
                  attributeName="height"
                  begin="svgSpinnersBlocksWave0.begin+0.3s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
              </rect>
              <rect width="7.33" height="7.33" x="1" y="15.66" fill="currentColor">
                <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.9s" values="1;4;1" />
                <animate
                  attributeName="y"
                  begin="svgSpinnersBlocksWave0.begin+0.3s"
                  dur="0.9s"
                  values="15.66;18.66;15.66"
                />
                <animate
                  attributeName="width"
                  begin="svgSpinnersBlocksWave0.begin+0.3s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
                <animate
                  attributeName="height"
                  begin="svgSpinnersBlocksWave0.begin+0.3s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
              </rect>
              <rect width="7.33" height="7.33" x="15.66" y="8.33" fill="currentColor">
                <animate
                  attributeName="x"
                  begin="svgSpinnersBlocksWave0.begin+0.45s"
                  dur="0.9s"
                  values="15.66;18.66;15.66"
                />
                <animate
                  attributeName="y"
                  begin="svgSpinnersBlocksWave0.begin+0.45s"
                  dur="0.9s"
                  values="8.33;11.33;8.33"
                />
                <animate
                  attributeName="width"
                  begin="svgSpinnersBlocksWave0.begin+0.45s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
                <animate
                  attributeName="height"
                  begin="svgSpinnersBlocksWave0.begin+0.45s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
              </rect>
              <rect width="7.33" height="7.33" x="8.33" y="15.66" fill="currentColor">
                <animate
                  attributeName="x"
                  begin="svgSpinnersBlocksWave0.begin+0.45s"
                  dur="0.9s"
                  values="8.33;11.33;8.33"
                />
                <animate
                  attributeName="y"
                  begin="svgSpinnersBlocksWave0.begin+0.45s"
                  dur="0.9s"
                  values="15.66;18.66;15.66"
                />
                <animate
                  attributeName="width"
                  begin="svgSpinnersBlocksWave0.begin+0.45s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
                <animate
                  attributeName="height"
                  begin="svgSpinnersBlocksWave0.begin+0.45s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
              </rect>
              <rect width="7.33" height="7.33" x="15.66" y="15.66" fill="currentColor">
                <animate
                  id="svgSpinnersBlocksWave1"
                  attributeName="x"
                  begin="svgSpinnersBlocksWave0.begin+0.6s"
                  dur="0.9s"
                  values="15.66;18.66;15.66"
                />
                <animate
                  attributeName="y"
                  begin="svgSpinnersBlocksWave0.begin+0.6s"
                  dur="0.9s"
                  values="15.66;18.66;15.66"
                />
                <animate
                  attributeName="width"
                  begin="svgSpinnersBlocksWave0.begin+0.6s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
                <animate
                  attributeName="height"
                  begin="svgSpinnersBlocksWave0.begin+0.6s"
                  dur="0.9s"
                  values="7.33;1.33;7.33"
                />
              </rect>
            </svg>`;

const Copy = `<svg  viewBox="0 0 1024 1024"
xmlns="http://www.w3.org/2000/svg"
width="24"
height="24"
fill="#ffffff"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">
<path d="M96.1 575.7a32.2 32.1 0 1 0 64.4 0 32.2 32.1 0 1 0-64.4 0Z"></path>
<path d="M742.1 450.7l-269.5-2.1c-14.3-0.1-26 13.8-26 31s11.7 31.3 26 31.4l269.5 2.1c14.3 0.1 26-13.8 26-31s-11.7-31.3-26-31.4zM742.1 577.7l-269.5-2.1c-14.3-0.1-26 13.8-26 31s11.7 31.3 26 31.4l269.5 2.1c14.3 0.2 26-13.8 26-31s-11.7-31.3-26-31.4z"></path>
<path d="M736.1 63.9H417c-70.4 0-128 57.6-128 128h-64.9c-70.4 0-128 57.6-128 128v128c-0.1 17.7 14.4 32 32.2 32 17.8 0 32.2-14.4 32.2-32.1V320c0-35.2 28.8-64 64-64H289v447.8c0 70.4 57.6 128 128 128h255.1c-0.1 35.2-28.8 63.8-64 63.8H224.5c-35.2 0-64-28.8-64-64V703.5c0-17.7-14.4-32.1-32.2-32.1-17.8 0-32.3 14.4-32.3 32.1v128.3c0 70.4 57.6 128 128 128h384.1c70.4 0 128-57.6 128-128h65c70.4 0 128-57.6 128-128V255.9l-193-192z m0.1 63.4l127.7 128.3H800c-35.2 0-64-28.8-64-64v-64.3h0.2z m64 641H416.1c-35.2 0-64-28.8-64-64v-513c0-35.2 28.8-64 64-64H671V191c0 70.4 57.6 128 128 128h65.2v385.3c0 35.2-28.8 64-64 64z"></path>
</svg>`;

export {
  Exclamation,
  Home,
  About,
  Other,
  TreeHollow,
  MessageBoard,
  FriendshipLinks,
  Music,
  PhotoAlbum,
  FullScreen,
  NonFullScreen,
  Arrow,
  Refresh,
  Copy
};
