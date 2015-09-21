from flask import render_template, request, url_for, session
from wally import app
from wally.cv import search2


# ここからウェブアプリケーション用のルーティングを記述
# index にアクセスしたときの処理
@app.route('/')
def index():
    return render_template('index.html')


# ファイルアップロード
@app.route('/upload', methods=['POST'])
def upload():
    up_file = request.files["up_file"]
    print(up_file)
    up_file.save("./wally/static/images/upload/" + up_file.filename)
    return (url_for('static', filename='images/upload/' + up_file.filename))


@app.route('/dosearch', methods=['POST'])
def dosearch():
    if request.json:
        reqjson = request.json
        canvas = reqjson.get("canvas")
        target = reqjson.get("target")
        # session['filename'] = filename
        retFname = search2.goSearch(canvas, target)
        print(retFname)

    if retFname:
        return (url_for('static', filename='images/upload/' + retFname))
    else:
        return


@app.route('/checkcomp', methods=['GET'])
def checkcomp():
    return (session['filename'])

if __name__ == '__main__':
    app.debug = True  # デバッグモード有効化
    app.run(host='0.0.0.0')  # どこからでもアクセス可能に
