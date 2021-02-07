
****************************
Surge 4.2+ 远程脚本配置 :
****************************
[Script]
Bili Region = type=http-response,pattern=^https:\/\/ap(p|i)\.bilibili\.com\/(pgc\/view\/(v\d\/)?app|x(\/v\d)?\/view\/video)\/(season|online)\?access_key,requires-body=1,max-size=0,control-api=1,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Bili_Auto_Regions.js

[MITM]
hostname = ap?.bilibili.com
****************************
*/

const Group = $persistentStore.read('BiliArea_Policy') || 'Bilibili'; //Your blibli policy group name.
const CN = $persistentStore.read('BiliArea_CN') || 'Direct'; //Your China sub-policy name.
const TW = $persistentStore.read('BiliArea_TW') || 'TW'; //Your Taiwan sub-policy name.
const HK = $persistentStore.read('BiliArea_HK') || 'HK'; //Your HongKong sub-policy name.

var obj = JSON.parse($response.body),
	obj = (obj.result || obj.data || {}).title || '';
const current = $surge.selectGroupDetails().decisions[Group] || 'Policy error ⚠️'
const str = (() => {
	if (obj.match(/\u50c5[\u4e00-\u9fa5]+\u6e2f/)) {
		if (current != HK) return HK;
	} else if (obj.match(/\u50c5[\u4e00-\u9fa5]+\u53f0/)) {
		if (current != TW) return TW;
	} else if (current != CN) return CN;
})()

if (str) {
	const change = $surge.setSelectGroupPolicy(Group, str);
	const notify = $persistentStore.read('BiliAreaNotify') === 'true';
	if (!notify) $notification.post(obj, ``, `${current}  =>  ${str}  =>  ${change?`成功`:`失败`}`);
	if (change) {
		$done(); //Kill the connection. Due to the characteristics of Surge, it will auto reconnect with the new policy.
	} else {
		$done({});
	}
} else {
	$done({});
}
