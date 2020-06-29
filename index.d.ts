/* main.ts 中 initDebugger 引入的日志查看插件的全局变量 */
declare const VConsole: any;
/* adjust 打点的 jssdk 暂时未使用 */
declare const Adjust: any;
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
}

interface Window {
  /* facebook 初始化函数 */
  fbAsyncInit?(): void;
  /* 登录完成通知游戏的回调 */
  rgAsyncInit: Function;

  test: any;
}
interface I18n {
  UnknownErr: string;
  msg001: string;
  errMsg001: string;
  errMsg002: string;
  code101: string;
  code102: string;
  dom001: string;
  dom002: string;
  dom003: string;
  dom004: string;
  dom005: string;
  dom007: string;
  dom008: string;
  dom009: string;
  dom010: string;
  dom011: string;
  dom012: string;
  dom014: string;

  PayCenter: string;
  Purchase: string;
  tuichu: string;
  loadException: string;
  loading: string;
  // ——————————————————————————————————————————————————————
  // txt_charge_num_tips: string;
  // txt_charge_way_tips: string;
  // txt_other_way: string;
  // txt_official: string;
  // txt_order_num_tips: string;
  // txt_charge_status_tips: string;
  // net_error_203: string;
  // txt_safe_set: string;
  // txt_check_charge: string;
  // txt_account_name: string;
  // txt_device_num: string;
  // float_button_user_center: string;
  // p2refresh_end_no_records: string;
  // float_button_service: string;
  // float_button_bind_account: string;
  // txt_change_psw: string;
  // net_error_30200: string;
  // ——————————————————————————————————————————————————————
  txt_fast: '快速开始 >>';
  txt_vistor: '游客账号登录';
  txt_title_pay: '支付中心';
  txt_title_user_center: '个人中心';
  txt_account_name: '账号:';
  txt_device_num: '设备号：';
  txt_change_psw: '修改密码';
  txt_safe_set: '安全设置';
  txt_warning_safe: '请立即进行安全设置';
  txt_check_charge: '查看充值记录';
  txt_account_remain: '账号余额 :';
  txt_login_game: '登录游戏';
  txt_register: '注册 ';
  txt_add_account: '+添加新账号';
  txt_select_account: '请选择账号';
  txt_second: '秒';
  txt_hint_account: '请输入账号';
  txt_hint_account_register: '请输入用户名（字母、数字、下划线4-50位）';
  txt_hint_password: '请输入密码(6~20)';
  txt_forget_password: '忘记密码？';
  txt_get_vifery: '获取验证码';
  txt_hint_vifery: '请输入验证码';
  txt_name_vistor: '(游客)';
  txt_send_vifery_err: '发送验证码失败';
  txt_check_vifery_err: '校验验证码失败';
  txt_register_err: '注册失败';
  txt_change_login: '切换登录方式>>';
  txt_show_pwd: '显示密码';
  txt_noinit: '未初始化';
  txt_nologin: '未登录';
  txt_comp_account: '账号：';
  txt_comp_pwd: '千奇密码：';
  txt_logining: '正在登录ing...';
  txt_switch_account: '切换账号';
  txt_welecome: '欢迎回来，';
  txt_account_err: '账号格式不正确';
  txt_password_err: '密码不符合要求';
  float_button_bind_account: '账号升级';
  float_button_user_center: '个人中心';
  float_button_message: '消息';
  float_button_service: '客服';
  float_button_forum: '论坛';
  txt_input_old_psw: '输入原密码';
  txt_input_new_psw: '输入新密码';
  txt_input_new_psw_again: '请再次输入新密码';
  txt_confirm: '确定';
  txt_cancel: '取消';
  txt_title_transaction: '交易记录';
  txt_title_consume: '消费记录';
  txt_charge_num_tips: '充值金额:';
  txt_charge_way_tips: '充值方式:';
  txt_order_num_tips: '订单号:';
  txt_charge_status_tips: '充值状态:';
  txt_title_change_bind: '修改绑定';
  txt_title_change_bind_phone: '修改绑定手机';
  txt_title_change_bind_email: '修改绑定邮箱';
  txt_title_bind_phone: '绑定手机';
  txt_title_bind_email: '绑定邮箱';
  tips_help_string: '友情提示:非游客用户修改或绑定手机和邮箱，用户名不会改变';
  tips_bind_already_phone: '已绑定的手机   :';
  tips_bind_already_email: '已绑定的邮箱   :';
  cg_txt_change: '更换';
  cg_txt_bind: '绑定';
  cg_txt_step_one: '第一步';
  cg_txt_step_two: '第二步';
  cg_txt_step_three: '第三步';
  cg_txt_warn_bind_phone: '账号安全级别低:建议绑定手机';
  cg_txt_warn_bind_email: '账号安全级别低:建议绑定邮箱';
  cg_txt_tips_bind_phone: '绑定手机后您的账号将变更为该手机号码，可通过该手机重置密码';
  cg_txt_tips_bind_email: '绑定邮箱后您的账号将变更为该邮箱号码，可通过该邮箱重置密码';
  cg_txt_hint_input_phone: '输入您要绑定的手机号码';
  cg_txt_hint_input_email: '输入您要绑定的邮箱';
  cg_txt_confirm_submit: '提交';
  cg_txt_wait_bind_phone: '待绑定手机号码:';
  cg_txt_wait_bind_email: '待绑定邮箱:';
  cg_txt_bind_sent_tip1: '验证码已发送至手机，请输入验证';
  cg_txt_bind_sent_tip2: '验证码已发送至邮箱，请输入验证';
  cg_txt_tip_input_psw: '请设置您的密码（6&#8211;20位）';
  cg_txt_sent_phone_tip: '已向您的手机发送了带有验证码的短信';
  cg_txt_sent_email_tip: '已向您的邮箱发送了带有验证码的邮件';
  cg_txt_change_bind_phone: '绑定手机后可以在忘记密码或账号被盗时通过手机重置密码';
  cg_txt_change_bind_email: '绑定邮箱后可以在忘记密码或账号被盗时通过邮箱重置密码';
  switch_bind_phone_tip: '<u>绑定手机</u>';
  switch_bind_email_tip: '绑定邮箱';
  account_bind_success: '账号绑定成功';
  account_not_bind_phone: '您暂未绑定手机';
  account_not_bind_email: '您暂未绑定邮箱';
  txt_find_pwd: '找回密码';
  txt_find_account: '找回账号';
  ui_forget_account_hint: '请到游戏官方网站或者facebook主页，联系客服。';
  ui_forget_unbind: '未绑定手机或邮箱';
  net_error_0: '未知错误！';
  net_error_000: '未知错误';
  net_error_001: '请输入正确的Email地址';
  net_error_002: '账号不能为空';
  net_error_003: '密码不能为空';
  net_error_004: '字符长度为4~50位，只允许输入 字母 数字 @ _ .';
  net_error_005: '密码长度应在6~20之间。';
  net_error_006: '两次输入的密码不一致';
  net_error_007: 'AppStore支付失败，请重试。';
  net_error_101: '账号已存在';
  net_error_102: '输入的帐号或者密码不正确';
  net_error_103: '用户输入不合法。';
  net_error_105: '该输入的账号不存在。';
  net_error_106: '此帐号尚未设置安全邮箱，请到游戏官方网站或者facebook主页，联系客服。';
  net_error_107: '密码输入错误';
  net_error_108: '该账号已存在，不能将游客升级至该账号。';
  net_error_200: '成功';
  net_error_201: '为避免重复订单，请您关闭该充值页面后重新下单';
  net_error_202: '该交易信息已经存在';
  net_error_203: '交易验证错误';
  net_error_204: '卡已经被使用或不存在';
  net_error_205: '卡的PIN和序列号有误';
  net_error_206: '订单正在处理当中。您可以在个人中心的订单记录中查看订单最新状态。';
  net_error_207: '卡未知错误';
  net_error_209: '查询订单流水的订单信息状态失败';
  net_error_210: '查询订单流水的订单信息状态不存在';
  net_error_222: '订单初始化状态';
  net_error_223: '平台币余额不足';
  net_error_224: '校验签名超时';
  net_error_225: '货币兑换异常';
  net_error_226: '卡号密码错误或者已经被使用！';
  net_error_227: '游戏可能已经下架，支付失败！';
  net_error_228: '其他位置错误，请通知客服！';
  net_error_229: '卡支付类型不支持';
  net_error_230: '购买商品不存在';
  net_error_500: '服务器异常';
  net_error_501: '提交必须是Post方式';
  net_error_502: '请检查传入的api_key参数是否正确';
  net_error_503: 'MD5验证失败';
  net_error_1001: '此用户已存在';
  net_error_1002: '账号或密码错误！';
  net_error_1003: '输入的格式有误！';
  net_error_1004: 'Token不存在或者失效！';
  net_error_1005: '用户名不存在！';
  net_error_1006: '密码校验失败！';
  net_error_1007: '绑定区服失败！';
  net_error_1008: '重置密码失败！';
  net_error_1009: '用户绑定邮箱或手机';
  net_error_1010: '校验码错误！';
  net_error_1011: '短信超过次数！';
  net_error_1022: '该账号已被封，请联系管理员！';
  net_error_2001: '交易处理中';
  net_error_2002: '支付失败';
  net_error_2003: '支付取消';
  net_error_3000: '您的充值正在处理中，请稍后';
  net_error_3001: '销卡成功，订单失败！';
  net_error_3002: '充值校验失败！';
  net_error_3003: '充值处理中';
  net_error_3004: '卡无效或被使用！';
  net_error_3005: '卡密不正常！';
  net_error_3006: '卡渠道正在维护中';
  net_error_3007: '交易凭据存在';
  net_error_3008: '充值汇率存在问题';
  net_error_3009: '充值订单不存在';
  net_error_4000: '消费初始化';
  net_error_4001: '平台币余额不足';
  net_error_4002: '重复游戏订单';
  net_error_4003: '充值成功，消费失败';
  net_error_4004: '消费订单不存在';
  net_error_5000: '服务器异常';
  net_error_5001: '提交必须是post方式';
  net_error_5002: '请检查传入的api_key参数是否正确';
  net_error_5003: 'MD5校验失败！';
  net_error_5004: '未知错误！';
  net_error_115: '因系统检测到您的账号存在刷单风险，为保障您的账号安全，现暂时无法登陆，请前往游戏粉丝页联系客服处理。';
  net_error_116: '因系统检测到您的账号存在刷单风险，为保障您的账号安全，现暂时无法注册，请前往游戏粉丝页联系客服处理。';
  net_error_235: '因系统检测您的账号存在刷单风险，为确保您的账号安全，24h后请再次尝试充值';
  net_error_236: '您今天充值此档位的次数已用完，为确保您的账号安全，请24h后再尝试充值';
  net_error_111111: '网络连接失败';

  // 下面是bluepay的code
  net_error_30200: '支付完成';
  net_error_30400: '支付出现异常，请重试';
  net_error_30405: '未安装支付所需软件或无SIM卡';
  net_error_30407: '短信发送错误';
  net_error_30408: '游戏厂商未储值或钱包余额不足';
  net_error_30500: 'BLUEPAY内部错误';
  net_error_30501: '网络连接异常，请检查网络';
  net_error_30504: '当日累计消费超过日限制';
  net_error_30505: '当月累计消费超过月限制';
  net_error_30506: '你已在黑黑名单中';
  net_error_30507: '消费间隔时间少于60s';
  net_error_30508: 'PIN码已经被使用';
  net_error_30509: 'PIN码不存在或非法';
  net_error_30510: 'PIN码已经过期';
  net_error_30511: '当前用户频繁试错，请稍候再试';
  net_error_30512: '银行卡账号已经绑定';
  net_error_30513: '钱包状态异常';
  net_error_30532: '该用户未绑定银行卡';
  net_error_30600: '运营商服务错误';
  net_error_30601: '余额不足';
  net_error_30602: '状态异常';
  net_error_30603: '取消支付';
  net_error_30611: '您的消费金额小于系统要求金额';
  net_error_30621: '被充值用户号码异常';
  net_error_30622: '充值卡余额异常';
  net_error_30623: '充值卡已过期';
  two_psw_unlike: '两次输入的密码不一致';
  error_net_not_connected: '网络未连接';
  password_empty: '密码不能为空！';
  password_length_error: '密码长度应在6~20之间。';
  account_not_empty: '账号名不能为空！';
  net_error: '请求失败，请检查网络是否连通';
  txt_remain: '余额：';
  txt_remain_unit: '平台币';
  txt_product_name: '商品名称：';
  txt_should_pay: '应支付：';
  txt_refresh_end_load_more: '更多';
  txt_pay_way: '支付方式';
  txt_pay_notice: '注：扣除支付金额后所剩余金额将自动转为千奇币';
  txt_pay_notsupport: '提示：请注意不支持V字开头的卡';
  txt_pay_fail_null: '卡号或密码为空';
  txt_hint_money: '请输入充值金额，单位(元)';
  txt_hint_input_serial: '请输入卡号';
  txt_hint_input_pin: '请输入PIN码';
  psw_change_success: '密码修改成功！';
  phone_not_valid: '请输入正确的手机号码';
  email_not_valid: '请输入正确的邮箱号码';
  varify_not_valid: '请输入正确的验证码';
  p2refresh_end_load_more: '更    多';
  p2refresh_end_no_records: '没有更多订单信息';
  p2refresh_release_refresh: '松开刷新';
  p2refresh_pull_to_refresh: '下拉刷新';
  p2refresh_doing_head_refresh: '正在刷新&#8230;';
  p2refresh_doing_end_refresh: '加载中&#8230;';
  p2refresh_refresh_lasttime: '最近更新&#160;&#058;&#160;';
  txt_verify_back: '验证找回';
  txt_unbind: '未绑定';
  txt_tips_bind: '为了账号安全，请立即安全设置';
  txt_reset_pwd_success: '重置密码成功！';
  ui_pay_records_button_more: '加载更多&#8230;';
  ui_pay_records_button_none: '没有更多订单信息';
  password_error: '原密码错误！';
  txt_customer_service: '客服中心';
  txt_see_probleme: '常见问题';
  txt_probleme_type: '问题类型';
  txt_probleme_acc: '账号服务';
  txt_probleme_charge: '充值支付';
  txt_common_problem_hint: '你好，下面常见问题可能有你的答案哦~';
  ui_customer_question_about_pwd: '如何找回密码？';
  ui_customer_answer_about_pwd: '请您进入登录界面，点击“忘记密码”，按提示信息找回密码。';
  ui_customer_question_about_account: '如何找回帐号？';
  ui_customer_answer_about_account: '您可以通过在登录框的下拉列表中查看帐号记录，如果您不小心删除了记录或者手机丢了，那么请去游戏的官方网站或FB主页联系客服人员。';
  ui_customer_question_about_update: '如何升级游客帐号？';
  ui_customer_answer_about_update: '登录成功后，您可以通过账号-帐号升级，按提示信息进行帐号升级。';
  ui_customer_question_about_modify_pwd: '如何修改密码？';
  ui_customer_answer_about_modify_pwd: '登录成功后，您可以通过账号-修改密码，按提示信息进行修改密码。';
  ui_customer_question_about_change_acc: '如何切换帐号？';
  ui_customer_answer_about_change_accd: '登录成功后，您可以通过账号-切换帐号。';
  ui_customer_question_about_bind_email: '如何设置安全邮箱？';
  ui_customer_answer_about_bind_email: '正式帐号用户，可以通过账号-安全设置，按提示信息设置安全邮箱。游客用户需要先升级到正式帐号，才能使用此功能。';
  ui_customer_question_payment: '充值后没有获得游戏道具，怎么办？';
  ui_customer_answer_payment: `1.充值成功后，正常情况下会在5分钟内发送游戏道具到您的账户中，请您耐心等待。\n
                   2.您可以通过账号-充值记录，查询充值订单状态。\n
                   3.如果充值状态是失败的，说明扣款未成功，请联系支付渠道商。\n
                   4.如果充值状态是成功的，并且未收到游戏道具，请您去游戏的官方网站或FB主页联系客服，并提供您的订单号。`;

  cg_txt_consume_buy: '购买商品';
  cg_txt_consume_cost: '消耗平台币';
  cg_txt_consume_order: '消费流水';
  cg_txt_consume_buy_status: '购买结果';
  cg_txt_exchange: '兑换';
  txt_card_pay_way: '选择卡支付方式';
  txt_platform_pay: '| 平台币支付';
  txt_platform_remain: '平台币余额：';
  txt_pay_success: '支付成功';
  txt_pay_fail: '支付失败';
  txt_pay_pending: '正在处理';
  txt_buy_success: '购买成功  ';
  txt_buy_fail: '购买失败';
  txt_back_game: '返回游戏';
  txt_safe_set_warn: '为了账号安全请进行安全设置';
  txt_set_immediately: '立即设置';
  txt_pay_again: '继续支付';
  txt_buy_again: '继续购买';
  txt_for_phone: '向手机';
  txt_for_email: '向邮箱';
  txt_send_verify: '发送验证码';
  txt_already_buy: '已成功购买';
  txt_attention_pay_status: '请关注交易记录中的交易状态';
  txt_coin_save: '充值金额已为您存储为平台币';
  txt_delete_account: '删除账号';
  txt_are_you_sure: '您确定要将';
  txt_delete_from_table: '从用户列表中删除么？';
  txt_pay: '支付';
  txt_facebook_login: 'Facebook账号登录';
  txt_other_login: '其他登录方式';
  txt_login_register: 'Login/Register';
  txt_login: 'Login';
  txt_register_usa: 'Register';
  txt_game_center: 'Game Center';
  txt_google: 'Google';
  txt_facebook_close: 'Facebook登录方式暂未开启';
  txt_input_psw_again: '请再次输入密码';
  txt_register_formal: '注册正式账号>';
  txt_send_email_success: '已向您账号所绑定邮箱中发送了密码修改链接，请查收！';
  txt_visitor_tips: '您当前是游客账号，请补填下列信息立即升级为正式账号。';
  txt_visitor_update_success: '游客账号升级成功！';
  txt_pay_show_proportion: '下滑显示兑换额度列表';
  txt_pay_proportion: '兑换额度列表';
  txt_pay_card_page: '点击显示充值界面';
  txt_google_service_missing: '请先安装GooglePlay';

  txt_serial: 'Serial：';
  txt_pin: 'PIN：';

  txt_password_wrong: '密码错误！';
  txt_verify_pwd: '为保证您的账户安全,请先输入您的密码。';
  txt_bind_warn: '安全邮箱是您之后找回密码和账号的唯一凭证，提交后将无法修改，请谨慎填写！';
  txt_input_valid_email: '请输入正确格式的邮箱！';
  txt_alert_msg1: '您确定使用';
  txt_alert_msg2: '为您的安全邮箱吗？设置后将无法自行修改！';
  txt_send_fail: '发送失败';
  txt_send_success: '发送成功';
  txt_warn: '提示';
  txt_copy: '复制';
  txt_copy_success: '已成功复制到剪贴板！';
  txt_update_fail: '升级失败';
  txt_tourist_update_tips: '您现在是游客身份，为了保障您的账号安全，我们强烈建议您现在就进行帐号升级！';
  txt_confirm_switch: '确认切换';
  txt_cancel_switch: '取消切换';
  txt_buy_success_tip: '交易成功！您可以在个人中心的订单记录中查询到订单信息。';
  txt_recharge_history: '充值记录';
  txt_official: '官方';
  txt_card: '刮刮卡';
  txt_other_way: '第三方';
  txt_pay_directly: '直冲';
  txt_not_tips_today: '今天不再显示';
  txt_ad_exit: '不玩了，我要退出';
  txt_exit_tip: '您确定退出游戏吗?';
  txt_have_bind: '已绑定：';
  txt_pay_not_open: '暂时未开通支付功能';
  txt_please_open_permission: '应用缺少运行所需权限，请在"设置">"应用">"权限"中配置';
  txt_not_get_special_permission: '应用缺少悬浮框显示所需要的权限，请授权';
  txt_pay_bean_null: '支付接口传入参数有误';
  txt_sure_pay: '你确定要购买商品：';
  txt_phone: '电话号码：';
  txt_not_input_phone: '请输入电话号码';
  txt_blue_atm: 'ATM';
  txt_blue_otc: 'OTC';
  cg_no_facebook_tip: '手机尚未安装Facebook客户端，请安装';
  txt_how_to_buy: '如何购买？';
  txt_kakao_login: 'Log in with Kakao';
  txt_exchange_rate: '兑换比例';
  txt_name_product: '商品：';
  txt_need_pay: '需支付：';
  txt_pay_defualt_tips: '备注：无';
  txt_google_login: 'Log in with Google+';
  txt_fb_live: 'LIVE';
  txt_plugin_pay_dialog_title: '安装提示';
  txt_plugin_pay_dialog_tip: '为了保证游戏充值安全顺畅，支付需要安装小工具Pocketgame';
  txt_plugin_pay_dialog_paybtn: '快速安装';
  winopen: '请跳转前往储值页面';
  jump: '跳转';
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
// 是否测试环境
declare var IS_TEST: string;
/* react js 的cdn地址 */
declare var reactSrc: string;
/* react-dom 的 cdn 地址 */
declare var reactDomSrc: string;
/* react-router-dom 的 cdn 地址 */
declare var reactRouterDomSrc: string;
/* 全局加载 MD5 */
declare const md5: (str: string) => string;
