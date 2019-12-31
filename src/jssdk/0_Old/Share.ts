export default class Share {
  static _ins: Share;
  static get instance(): Share {
    return this._ins || new Share();
  }
  constructor() {
    Share._ins = this;
  }

  share(shareUrl) {
    console.info('facebook share' + shareUrl);
    return new Promise((resolve, reject) => {
      FB.ui(
        {
          method: 'share',
          href: shareUrl,
          display: 'popup'
        },
        function(shareDialogResponse) {
          if (shareDialogResponse) {
            if (shareDialogResponse.error_message) {
              resolve({
                code: 0,
                error_msg: shareDialogResponse.error_message
              });
            } else {
              resolve({
                code: 200
              });
            }
          } else {
            resolve({
              code: 0
            });
          }
        }
      );
    });
  }
}
