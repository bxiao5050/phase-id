/* main.ts 中 initDebugger 引入的日志查看插件的全局变量 */
declare const VConsole: any;
/* adjust 打点的 jssdk 暂时未使用 */
declare const Adjust: any;
declare const CryptoJS: {
  MD5: (str: string) => {toString: () => string};
  enc: {Utf8: {parse: (str: string) => string}};
  mode: {CBC: string};
  pad: {Pkcs7: string};
  AES: {
    decrypt: (
      str: string,
      key: string,
      config: {iv: string; mode: string; padding: string}
    ) => {toString: (type?: any) => string};
  };
};
/* 地址栏参数 */
interface UrlParams {
  appId: string;
  advChannel: string;
  sdkVersion: string;
  debugger?: string;
  /* web端的投放的广告参数 */
  advertiseId?: string;
  /* 微端 fb 登录参数 */
  code?: string;
  [key: string]: string;
}

interface Config {
  /* 后端加密参数 */
  appKey: string;
  /* 现在仅 quick 有 */
  appSecret?: string;
  /* facebook appId */
  fbAppId: string;
  /* sdk 语言 */
  language: string;
  /* 语言包 */
  i18n: I18n;
  // 悬浮球距离顶边的距离rem
  hoverTop: string;
  // 悬浮球是在左边还是右边
  hoverFromLeft: boolean;
  /* 是否官方支付打点 */
  isPurchasedMark: boolean;
  /* 粉丝页地址 */
  fans: string;
  /* facebook messager 在 pc端和移动端对应的页面 */
  fbMessengerPc?: string;
  fbMessengerMb?: string;
  /* 仅web端需要 */
  /* 游戏名, */
  name?: string;
  /* ios下载包下载地址 */
  iosDonloadUrl?: string;
  /* android 微端包下载地址 */
  androidDonloadUrl?: string;
  /* 公司自己开发游戏的首页的地址 如: https://www.narutoh5game.com/h5-plays/index.html*/
  indexUrl?: string;
  /* 修改请求地址 */
  server?: string;
  markFBID?: string;
  markGAID?: string;
  /* adjust 打点,原生端有 */
  adjustId?: string;
  /* adjust 打点的所有的 token */
  adjustToken?: {
    [key: string]: string;
  };
  /* 对固定点点名的适配 */
  markName?: {
    /* sdk加载完成 */
    sdk_loaded: string;
    /* 购买点 */
    sdk_purchased_done: string;
    /* 注册点 */
    sdk_register: string;
    /* 联系客服 */
    sdk_contact_us: string;
  };
  /* quick 参数 */
  productCode?: string;
  productKey?: string;
}
interface ExtendedConfig extends Config {
  /* sdk 类型 */
  type: number;
  /* 地址栏参数 */
  urlParams: UrlParams;
  /* 语言包 */
  i18n: I18n;
  /* facebook jssdk 是否加载完成 */
  fb_sdk_loaded: boolean;
  /** 游客是否需要在登录时没各多少时间弹出提示升级弹窗*/
  popUpInterval: number;
  /** 第一次弹窗时间 */
  firstPopUpInterval: number;
  /** 控制是否需要游客升级弹窗 */
  popUpSwitch: boolean;
  bindVisitorGiftUrl: string;
}

interface Window {
  /* facebook 初始化函数 */
  fbAsyncInit?(): void;
  /* 登录完成通知游戏的回调 */
  rgAsyncInit: Function;
  // 打补丁
  // RgPolyfilled: Function;
  CryptoJS: typeof CryptoJS;
  /* IE */
  ActiveXObject: any;
}
interface I18n {
  txt_fast: string; // '快速开始 >>';
  // txt_vistor:string;// '游客账号登录';
  txt_title_pay: string; // '支付中心';
  txt_title_user_center: string; // '个人中心';
  txt_account_name: string; // '账号:';
  txt_device_num: string; // '设备号：';
  txt_change_psw: string; // '修改密码';
  txt_safe_set: string; // '安全设置';
  txt_warning_safe: string; // '请立即进行安全设置';
  txt_check_charge: string; // '查看充值记录';
  // txt_account_remain:string;// '账号余额 :';
  txt_login_game: string; // '登录游戏';
  txt_register: string; // '注册 ';
  // txt_add_account:string;// '+添加新账号';
  txt_select_account: string; // '请选择账号';
  // txt_second:string;// '秒';
  txt_hint_account: string; // '请输入账号';
  txt_hint_account_register: string; // '请输入用户名（字母、数字、下划线4-50位）';
  txt_hint_password: string; // '请输入密码(6~20)';
  txt_forget_password: string; // '忘记密码？';
  // txt_get_vifery:string;// '获取验证码';
  // txt_hint_vifery:string;// '请输入验证码';
  txt_name_vistor: string; // '(游客)';
  // txt_send_vifery_err:string;// '发送验证码失败';
  // txt_check_vifery_err:string;// '校验验证码失败';
  // txt_register_err:string;// '注册失败';
  txt_change_login: string; // '切换登录方式>>';
  txt_show_pwd: string; // '显示密码';
  // txt_noinit:string;// '未初始化';
  // txt_nologin:string;// '未登录';
  // txt_comp_account:string;// '账号：';
  // txt_comp_pwd:string;// '千奇密码：';
  txt_logining: string; // '正在登录ing...';
  txt_switch_account: string; // '切换账号';
  // txt_welecome:string;// '欢迎回来，';
  // txt_account_err:string;// '账号格式不正确';
  // txt_password_err:string;// '密码不符合要求';
  float_button_bind_account: string; // '账号升级';
  float_button_user_center: string; // '个人中心';
  // float_button_message:string;// '消息';
  float_button_service: string; // '客服';
  // float_button_forum:string;// '论坛';
  txt_input_old_psw: string; // '输入原密码';
  txt_input_new_psw: string; // '输入新密码';
  txt_input_new_psw_again: string; // '请再次输入新密码';
  txt_confirm: string; // '确定';
  txt_cancel: string; // '取消';
  // txt_title_transaction:string;// '交易记录';
  // txt_title_consume:string;// '消费记录';
  txt_charge_num_tips: string; // '充值金额:';
  txt_charge_way_tips: string; // '充值方式:';
  txt_order_num_tips: string; // '订单号:';
  txt_charge_status_tips: string; // '充值状态:';
  // txt_title_change_bind:string;// '修改绑定';
  // txt_title_change_bind_phone:string;// '修改绑定手机';
  // txt_title_change_bind_email:string;// '修改绑定邮箱';
  // txt_title_bind_phone:string;// '绑定手机';
  // txt_title_bind_email:string;// '绑定邮箱';
  // tips_help_string:string;// '友情提示:非游客用户修改或绑定手机和邮箱，用户名不会改变';
  // tips_bind_already_phone:string;// '已绑定的手机   :';
  // tips_bind_already_email:string;// '已绑定的邮箱   :';
  // cg_txt_change:string;// '更换';
  // cg_txt_bind:string;// '绑定';
  cg_txt_step_one: string; // '第一步';
  cg_txt_step_two: string; // '第二步';
  // cg_txt_step_three:string;// '第三步';
  // cg_txt_warn_bind_phone:string;// '账号安全级别低:建议绑定手机';
  // cg_txt_warn_bind_email:string;// '账号安全级别低:建议绑定邮箱';
  // cg_txt_tips_bind_phone:string;// '绑定手机后您的账号将变更为该手机号码，可通过该手机重置密码';
  // cg_txt_tips_bind_email:string;// '绑定邮箱后您的账号将变更为该邮箱号码，可通过该邮箱重置密码';
  // cg_txt_hint_input_phone:string;// '输入您要绑定的手机号码';
  cg_txt_hint_input_email: string; // '输入您要绑定的邮箱';
  cg_txt_confirm_submit: string; // '提交';
  // cg_txt_wait_bind_phone:string;// '待绑定手机号码:';
  // cg_txt_wait_bind_email:string;// '待绑定邮箱:';
  // cg_txt_bind_sent_tip1:string;// '验证码已发送至手机，请输入验证';
  // cg_txt_bind_sent_tip2:string;// '验证码已发送至邮箱，请输入验证';
  // cg_txt_tip_input_psw:string;// '请设置您的密码（6&#8211;20位）';
  // cg_txt_sent_phone_tip:string;// '已向您的手机发送了带有验证码的短信';
  // cg_txt_sent_email_tip:string;// '已向您的邮箱发送了带有验证码的邮件';
  // cg_txt_change_bind_phone:string;// '绑定手机后可以在忘记密码或账号被盗时通过手机重置密码';
  // cg_txt_change_bind_email:string;// '绑定邮箱后可以在忘记密码或账号被盗时通过邮箱重置密码';
  // switch_bind_phone_tip:string;// '<u>绑定手机</u>';
  // switch_bind_email_tip:string;// '绑定邮箱';
  account_bind_success: string; // '账号绑定成功';
  // account_not_bind_phone:string;// '您暂未绑定手机';
  // account_not_bind_email:string;// '您暂未绑定邮箱';
  txt_find_pwd: string; // '找回密码';
  txt_find_account: string; // '找回账号';
  ui_forget_account_hint: string; // '请到游戏官方网站或者facebook主页，联系客服。';
  // ui_forget_unbind:string;// '未绑定手机或邮箱';
  net_error_0: string; // '未知错误！';
  // net_error_000:string;// '未知错误';
  // net_error_001:string;// '请输入正确的Email地址';
  // net_error_002:string;// '账号不能为空';
  // net_error_003:string;// '密码不能为空';
  net_error_004: string; // '字符长度为4~50位，只允许输入 字母 数字 @ _ .';
  net_error_005: string; // '密码长度应在6~20之间。';
  net_error_006: string; // '两次输入的密码不一致';
  // net_error_007:string;// 'AppStore支付失败，请重试。';
  net_error_101: string; // '账号已存在';
  net_error_102: string; // '输入的帐号或者密码不正确';
  net_error_103: string; // '用户输入不合法。';
  net_error_105: string; // '该输入的账号不存在。';
  net_error_106: string; // '此帐号尚未设置安全邮箱，请到游戏官方网站或者facebook主页，联系客服。';
  net_error_107: string; // '密码输入错误';
  net_error_108: string; // '该账号已存在，不能将游客升级至该账号。';
  net_error_200: string; // '成功';
  net_error_201: string; // '为避免重复订单，请您关闭该充值页面后重新下单';
  net_error_202: string; // '该交易信息已经存在';
  net_error_203: string; // '交易验证错误';
  net_error_204: string; // '卡已经被使用或不存在';
  net_error_205: string; // '卡的PIN和序列号有误';
  net_error_206: string; // '订单正在处理当中。您可以在个人中心的订单记录中查看订单最新状态。';
  net_error_207: string; // '卡未知错误';
  // net_error_209:string;// '查询订单流水的订单信息状态失败';
  // net_error_210:string;// '查询订单流水的订单信息状态不存在';
  // net_error_222:string;// '订单初始化状态';
  // net_error_223:string;// '平台币余额不足';
  // net_error_224:string;// '校验签名超时';
  // net_error_225:string;// '货币兑换异常';
  // net_error_226:string;// '卡号密码错误或者已经被使用！';
  // net_error_227:string;// '游戏可能已经下架，支付失败！';
  // net_error_228:string;// '其他位置错误，请通知客服！';
  // net_error_229:string;// '卡支付类型不支持';
  // net_error_230:string;// '购买商品不存在';
  // net_error_500:string;// '服务器异常';
  // net_error_501:string;// '提交必须是Post方式';
  // net_error_502:string;// '请检查传入的api_key参数是否正确';
  // net_error_503:string;// 'MD5验证失败';
  // net_error_1001:string;// '此用户已存在';
  // net_error_1002:string;// '账号或密码错误！';
  // net_error_1003:string;// '输入的格式有误！';
  // net_error_1004:string;// 'Token不存在或者失效！';
  // net_error_1005:string;// '用户名不存在！';
  // net_error_1006:string;// '密码校验失败！';
  // net_error_1007:string;// '绑定区服失败！';
  // net_error_1008:string;// '重置密码失败！';
  // net_error_1009:string;// '用户绑定邮箱或手机';
  // net_error_1010:string;// '校验码错误！';
  // net_error_1011:string;// '短信超过次数！';
  // net_error_1022:string;// '该账号已被封，请联系管理员！';
  // net_error_2001:string;// '交易处理中';
  // net_error_2002:string;// '支付失败';
  // net_error_2003:string;// '支付取消';
  // net_error_3000:string;// '您的充值正在处理中，请稍后';
  // net_error_3001:string;// '销卡成功，订单失败！';
  // net_error_3002:string;// '充值校验失败！';
  // net_error_3003:string;// '充值处理中';
  // net_error_3004:string;// '卡无效或被使用！';
  // net_error_3005:string;// '卡密不正常！';
  // net_error_3006:string;// '卡渠道正在维护中';
  // net_error_3007:string;// '交易凭据存在';
  // net_error_3008:string;// '充值汇率存在问题';
  // net_error_3009:string;// '充值订单不存在';
  // net_error_4000:string;// '消费初始化';
  // net_error_4001:string;// '平台币余额不足';
  // net_error_4002:string;// '重复游戏订单';
  // net_error_4003:string;// '充值成功，消费失败';
  // net_error_4004:string;// '消费订单不存在';
  // net_error_5000:string;// '服务器异常';
  // net_error_5001:string;// '提交必须是post方式';
  // net_error_5002:string;// '请检查传入的api_key参数是否正确';
  // net_error_5003:string;// 'MD5校验失败！';
  // net_error_5004:string;// '未知错误！';
  // net_error_115:string;// '因系统检测到您的账号存在刷单风险，为保障您的账号安全，现暂时无法登陆，请前往游戏粉丝页联系客服处理。';
  // net_error_116:string;// '因系统检测到您的账号存在刷单风险，为保障您的账号安全，现暂时无法注册，请前往游戏粉丝页联系客服处理。';
  // net_error_235:string;// '因系统检测您的账号存在刷单风险，为确保您的账号安全，24h后请再次尝试充值';
  // net_error_236:string;// '您今天充值此档位的次数已用完，为确保您的账号安全，请24h后再尝试充值';
  // net_error_111111:string;// '网络连接失败';

  // 下面是bluepay的code
  net_error_30200:string;// '支付完成';
  // net_error_30400:string;// '支付出现异常，请重试';
  // net_error_30405:string;// '未安装支付所需软件或无SIM卡';
  // net_error_30407:string;// '短信发送错误';
  // net_error_30408:string;// '游戏厂商未储值或钱包余额不足';
  // net_error_30500:string;// 'BLUEPAY内部错误';
  // net_error_30501:string;// '网络连接异常，请检查网络';
  // net_error_30504:string;// '当日累计消费超过日限制';
  // net_error_30505:string;// '当月累计消费超过月限制';
  // net_error_30506:string;// '你已在黑黑名单中';
  // net_error_30507:string;// '消费间隔时间少于60s';
  // net_error_30508:string;// 'PIN码已经被使用';
  // net_error_30509:string;// 'PIN码不存在或非法';
  // net_error_30510:string;// 'PIN码已经过期';
  // net_error_30511:string;// '当前用户频繁试错，请稍候再试';
  // net_error_30512:string;// '银行卡账号已经绑定';
  // net_error_30513:string;// '钱包状态异常';
  // net_error_30532:string;// '该用户未绑定银行卡';
  // net_error_30600:string;// '运营商服务错误';
  // net_error_30601:string;// '余额不足';
  // net_error_30602:string;// '状态异常';
  // net_error_30603:string;// '取消支付';
  // net_error_30611:string;// '您的消费金额小于系统要求金额';
  // net_error_30621:string;// '被充值用户号码异常';
  // net_error_30622:string;// '充值卡余额异常';
  // net_error_30623:string;// '充值卡已过期';
  // two_psw_unlike:string;// '两次输入的密码不一致';
  // error_net_not_connected:string;// '网络未连接';
  // password_empty:string;// '密码不能为空！';
  // password_length_error:string;// '密码长度应在6~20之间。';
  // account_not_empty:string;// '账号名不能为空！';
  net_error: string; // '请求失败，请检查网络是否连通';
  // txt_remain:string;// '余额：';
  // txt_remain_unit:string;// '平台币';
  // txt_product_name:string;// '商品名称：';
  // txt_should_pay:string;// '应支付：';
  // txt_refresh_end_load_more:string;// '更多';
  // txt_pay_way:string;// '支付方式';
  // txt_pay_notice:string;// '注：扣除支付金额后所剩余金额将自动转为千奇币';
  // txt_pay_notsupport:string;// '提示：请注意不支持V字开头的卡';
  // txt_pay_fail_null:string;// '卡号或密码为空';
  // txt_hint_money:string;// '请输入充值金额，单位(元)';
  txt_hint_input_serial: string; // '请输入卡号';
  txt_hint_input_pin: string; // '请输入PIN码';
  psw_change_success: string; // '密码修改成功！';
  // phone_not_valid:string;// '请输入正确的手机号码';
  // email_not_valid:string;// '请输入正确的邮箱号码';
  // varify_not_valid:string;// '请输入正确的验证码';
  // p2refresh_end_load_more:string;// '更    多';
  p2refresh_end_no_records: string; // '没有更多订单信息';
  // p2refresh_release_refresh:string;// '松开刷新';
  // p2refresh_pull_to_refresh:string;// '下拉刷新';
  // p2refresh_doing_head_refresh:string;// '正在刷新&#8230;';
  // p2refresh_doing_end_refresh:string;// '加载中&#8230;';
  // p2refresh_refresh_lasttime:string;// '最近更新&#160;&#058;&#160;';
  // txt_verify_back:string;// '验证找回';
  // txt_unbind:string;// '未绑定';
  txt_tips_bind: string; // '为了账号安全，请立即安全设置';
  // txt_reset_pwd_success:string;// '重置密码成功！';
  // ui_pay_records_button_more:string;// '加载更多&#8230;';
  // ui_pay_records_button_none:string;// '没有更多订单信息';
  // password_error:string;// '原密码错误！';
  // txt_customer_service:string;// '客服中心';
  // txt_see_probleme:string;// '常见问题';
  // txt_probleme_type:string;// '问题类型';
  // txt_probleme_acc:string;// '账号服务';
  // txt_probleme_charge:string;// '充值支付';
  // txt_common_problem_hint:string;// '你好，下面常见问题可能有你的答案哦~';
  // ui_customer_question_about_pwd:string;// '如何找回密码？';
  // ui_customer_answer_about_pwd:string;// '请您进入登录界面，点击“忘记密码”，按提示信息找回密码。';
  // ui_customer_question_about_account:string;// '如何找回帐号？';
  // ui_customer_answer_about_account:string;// '您可以通过在登录框的下拉列表中查看帐号记录，如果您不小心删除了记录或者手机丢了，那么请去游戏的官方网站或FB主页联系客服人员。';
  // ui_customer_question_about_update:string;// '如何升级游客帐号？';
  // ui_customer_answer_about_update:string;// '登录成功后，您可以通过账号-帐号升级，按提示信息进行帐号升级。';
  // ui_customer_question_about_modify_pwd:string;// '如何修改密码？';
  // ui_customer_answer_about_modify_pwd:string;// '登录成功后，您可以通过账号-修改密码，按提示信息进行修改密码。';
  // ui_customer_question_about_change_acc:string;// '如何切换帐号？';
  // ui_customer_answer_about_change_accd:string;// '登录成功后，您可以通过账号-切换帐号。';
  // ui_customer_question_about_bind_email:string;// '如何设置安全邮箱？';
  // ui_customer_answer_about_bind_email:string;// '正式帐号用户，可以通过账号-安全设置，按提示信息设置安全邮箱。游客用户需要先升级到正式帐号，才能使用此功能。';
  // ui_customer_question_payment:string;// '充值后没有获得游戏道具，怎么办？';
  // ui_customer_answer_payment: `1.充值成功后，正常情况下会在5分钟内发送游戏道具到您的账户中，请您耐心等待。\n
  //                 2.您可以通过账号-充值记录，查询充值订单状态。\n
  //                 3.如果充值状态是失败的，说明扣款未成功，请联系支付渠道商。\n
  //                 4.如果充值状态是成功的，并且未收到游戏道具，请您去游戏的官方网站或FB主页联系客服，并提供您的订单号。`;

  cg_txt_consume_buy: string; // '购买商品';
  // cg_txt_consume_cost:string;// '消耗平台币';
  // cg_txt_consume_order:string;// '消费流水';
  // cg_txt_consume_buy_status:string;// '购买结果';
  // cg_txt_exchange:string;// '兑换';
  // txt_card_pay_way:string;// '选择卡支付方式';
  // txt_platform_pay:string;// '| 平台币支付';
  // txt_platform_remain:string;// '平台币余额：';
  txt_pay_success: string; // '支付成功';
  txt_pay_fail: string; // '支付失败';
  txt_pay_pending: string; // '正在处理';
  // txt_buy_success:string;// '购买成功  ';
  // txt_buy_fail:string;// '购买失败';
  // txt_back_game:string;// '返回游戏';
  // txt_safe_set_warn:string;// '为了账号安全请进行安全设置';
  // txt_set_immediately:string;// '立即设置';
  // txt_pay_again:string;// '继续支付';
  // txt_buy_again:string;// '继续购买';
  // txt_for_phone:string;// '向手机';
  // txt_for_email:string;// '向邮箱';
  // txt_send_verify:string;// '发送验证码';
  // txt_already_buy:string;// '已成功购买';
  // txt_attention_pay_status:string;// '请关注交易记录中的交易状态';
  // txt_coin_save:string;// '充值金额已为您存储为平台币';
  txt_delete_account: string; // '删除账号';
  txt_are_you_sure: string; // '您确定要将';
  txt_delete_from_table: string; // '从用户列表中删除么？';
  txt_pay: string; // '支付';
  txt_facebook_login: string; // 'Facebook账号登录';
  txt_other_login: string; // '其他登录方式';
  // txt_login_register:string;// 'Login/Register';
  txt_login: string; // 'Login';
  txt_register_usa: string; // 'Register';
  // txt_game_center:string;// 'Game Center';
  // txt_google:string;// 'Google';
  // txt_facebook_close:string;// 'Facebook登录方式暂未开启';
  txt_input_psw_again: string; // '请再次输入密码';
  txt_register_formal: string; // '注册正式账号>';
  txt_send_email_success: string; // '已向您账号所绑定邮箱中发送了密码修改链接，请查收！';
  // txt_visitor_tips:string;// '您当前是游客账号，请补填下列信息立即升级为正式账号。';
  // txt_visitor_update_success:string;// '游客账号升级成功！';
  // txt_pay_show_proportion:string;// '下滑显示兑换额度列表';
  // txt_pay_proportion:string;// '兑换额度列表';
  // txt_pay_card_page:string;// '点击显示充值界面';
  // txt_google_service_missing:string;// '请先安装GooglePlay';

  txt_serial: string; // 'Serial：';
  txt_pin: string; // 'PIN：';

  // txt_password_wrong:string;// '密码错误！';
  txt_verify_pwd: string; // '为保证您的账户安全,请先输入您的密码。';
  txt_bind_warn: string; // '安全邮箱是您之后找回密码和账号的唯一凭证，提交后将无法修改，请谨慎填写！';
  txt_input_valid_email: string; // '请输入正确格式的邮箱！';
  // txt_alert_msg1:string;// '您确定使用';
  // txt_alert_msg2:string;// '为您的安全邮箱吗？设置后将无法自行修改！';
  txt_send_fail: string; // '发送失败';
  txt_send_success: string; // '发送成功';
  txt_warn: string; // '提示';
  txt_copy: string; // '复制';
  txt_copy_success: string; // '已成功复制到剪贴板！';
  // txt_update_fail:string;// '升级失败';
  // txt_tourist_update_tips:string;// '您现在是游客身份，为了保障您的账号安全，我们强烈建议您现在就进行帐号升级！';
  // txt_confirm_switch:string;// '确认切换';
  // txt_cancel_switch:string;// '取消切换';
  // txt_buy_success_tip:string;// '交易成功！您可以在个人中心的订单记录中查询到订单信息。';
  txt_recharge_history: string; // '充值记录';
  txt_official: string; // '官方';
  // txt_card:string;// '刮刮卡';
  txt_other_way: string; // '第三方';
  // txt_pay_directly:string;// '直冲';
  // txt_not_tips_today:string;// '今天不再显示';
  // txt_ad_exit:string;// '不玩了，我要退出';
  txt_exit_tip: string; // '您确定退出游戏吗?';
  // txt_have_bind:string;// '已绑定：';
  txt_pay_not_open: string; // '暂时未开通支付功能';
  // txt_please_open_permission:string;// '应用缺少运行所需权限，请在"设置">"应用">"权限"中配置';
  // txt_not_get_special_permission:string;// '应用缺少悬浮框显示所需要的权限，请授权';
  // txt_pay_bean_null:string;// '支付接口传入参数有误';
  // txt_sure_pay:string;// '你确定要购买商品：';
  // txt_phone:string;// '电话号码：';
  // txt_not_input_phone:string;// '请输入电话号码';
  // txt_blue_atm:string;// 'ATM';
  // txt_blue_otc:string;// 'OTC';
  // cg_no_facebook_tip:string;// '手机尚未安装Facebook客户端，请安装';
  // txt_how_to_buy:string;// '如何购买？';
  // txt_kakao_login:string;// 'Log in with Kakao';
  txt_exchange_rate: string; // '兑换比例';
  txt_name_product: string; // '商品：';
  // txt_need_pay:string;// '需支付：';
  /** 备注：无 */
  txt_pay_defualt_tips: string;
  // txt_google_login:string;// 'Log in with Google+';
  // txt_fb_live:string;// 'LIVE';
  // txt_plugin_pay_dialog_title:string;// '安装提示';
  // txt_plugin_pay_dialog_tip:string;// '为了保证游戏充值安全顺畅，支付需要安装小工具Pocketgame';
  // txt_plugin_pay_dialog_paybtn:string;// '快速安装';
  /** 请跳转前往储值页面 */
  winopen: string;
  /** 跳转 */
  jump: string;
  /** 密码： */
  password: string;
  /** "您当前使用的是游客账号！游客账号易丢失，建议您尽快升级为安全稳定的“正式账号”（升级后即可领取奖励礼包！）" */
  bindVisitorTxt: string;
  /** 立即前往升级 */
  toBindTxt: string;
  /** 下次提醒我 */
  nextTipTxt: string;
  /** 游客账号升级成功！ */
  bindSuccessTitleTxt: string;
  /** 复制账号密码并保存于备忘录，便于下次查找，防止账号丢失。 */
  bindSuccessMsgTxt: string;
  /** 复制账号密码 */
  copyBtnTxt: string;
  /** 前往领取奖励 */
  toGetGiftTxt: string;
  /** 继续游戏 */
  continueTxt: string;
  /** 您已成功注册为正式账号！ */
  registerVisitorSuccessTxt: string;
  /** 账号密码复制成功，记得保存到备忘录哦！ */
  copySuccessTxt: string;
  /** 账号密码 */
  userNameAndPwdTxt: string;
  /** 如遗失账号密码请通过fb平台找回 */
  copyFbTxt: string;
  /** 如遗失账号密码请通过kakao平台找回 */
  copyKakaoTxt: string;
}

// webpack中设置
/*  facebook jssdk 的版本*/
declare var FBVersion: string;
/* sdk 版本 */
declare var VERSION: string;
/* 服务器域名 静态资源请求 origin, 请求后台的 origin*/
declare var SERVER: string;
// 是否开发环境
declare var IS_DEV: string;
/* react js 的cdn地址 */
declare var reactSrc: string;
/* react-dom 的 cdn 地址 */
declare var reactDomSrc: string;
/* react-router-dom 的 cdn 地址 */
declare var reactRouterDomSrc: string;

/* IE */
declare const ActiveXObject:any;
