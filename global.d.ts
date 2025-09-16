// global.d.ts

interface HTMLElement {
	// WebKit浏览器前缀的全屏方法
	webkitRequestFullscreen?: () => Promise<void>;
	// Mozilla浏览器前缀的全屏方法
	mozRequestFullScreen?: () => Promise<void>;
	// IE浏览器前缀的全屏方法
	msRequestFullscreen?: () => Promise<void>;

	// WebKit浏览器前缀的退出全屏方法
	webkitExitFullscreen?: () => Promise<void>;
	// Mozilla浏览器前缀的退出全屏方法
	mozCancelFullScreen?: () => Promise<void>;
	// IE浏览器前缀的退出全屏方法
	msExitFullscreen?: () => Promise<void>;
}

interface Document {
	// WebKit浏览器前缀的全屏元素属性
	webkitFullscreenElement?: HTMLElement | null;
	// Mozilla浏览器前缀的全屏元素属性
	mozFullScreenElement?: HTMLElement | null;
	// IE浏览器前缀的全屏元素属性
	msFullscreenElement?: HTMLElement | null;

	// WebKit浏览器前缀的全屏变更事件
	onwebkitfullscreenchange?: ((this: Document, ev: Event) => any) | null;
	// Mozilla浏览器前缀的全屏变更事件
	onmozfullscreenchange?: ((this: Document, ev: Event) => any) | null;
	// IE浏览器前缀的全屏变更事件
	onmsfullscreenchange?: ((this: Document, ev: Event) => any) | null;
}
