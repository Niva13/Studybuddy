from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# the data
items = [
    {"id": 1, "name": "HIT", "image": "https://upload.wikimedia.org/wikipedia/he/d/df/Logo_hit%2B50.jpg", "degrees":["math","computers"]},
    {"id": 2, "name": "The Open University Of Israel", "image": "https://image.modiinapp.com/50863f87d8c36_300_300_crop.jpg", "degrees":["math","computers"]},
    {"id": 3, "name": "David Yellin College", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSocvhygEqxZAmvVkXASzRKbjb25aKfF2ioCA&s", "degrees":[""]},
    {"id": 4, "name": "Yezreel Valley College", "image": "https://helmsleytrust.org/wp-content/uploads/2022/03/Yezreel_Logo_600x400.ccd32e5df7dfc091ce6f49cc36f4bcb7b04433c6-2-1024x512-1.png", "degrees":[""]},
    {"id": 5, "name": "Tel Hai College", "image": "https://voice-over.co.il/wp-content/uploads/2018/05/tel-hai.jpg", "degrees":[""]},
    {"id": 6, "name": "Afeka", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMnJ3v-l1zGL4RR2UjfZE5dCg7L6wwfV-kLA&s", "degrees":[""]},
    {"id": 7, "name": "Sapir College", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt3RtKUBP4QlzLw50pLMIrnCn4GfsvoRjMMQ&s", "degrees":[""]},
    {"id": 8, "name": "Ashkelon College", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO444uTRRYCAd_nGQNrlPZDfnqVTEWo8RF5A&s", "degrees":[""]},
    {"id": 9, "name": "Kinneret College on the sea of Galilee", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxwY0MSQ5juJmNP4wKLkrEEGret7pm8xluCw&s", "degrees":[""]},
    {"id": 10, "name": "Kibbutzim College", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMXl5YPjX__o6Y_jgyaOPUP9Z_xWOwhcvImw&s", "degrees":[""]},
    {"id": 11, "name": "Oranim College", "image": "https://re-levant.co.il/wp-content/uploads/2022/07/oranim-mobile-thumbnail-1.jpg", "degrees":[""]},
    {"id": 12, "name": "The Hebrew University Of Jerusalem", "image": "https://media.licdn.com/dms/image/v2/C4E0BAQEj9V8AF7dbfw/company-logo_200_200/company-logo_200_200/0/1631319056421?e=2147483647&v=beta&t=2IwdfJmtBTST-auZWD3iy3t994OT7puTq3A79hsANqk", "degrees":[""]},
    {"id": 13, "name": "Technion", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5fBJR5sbm7gYwtUx68K7276WzCmAm-R3cNA&s", "degrees":[""]},
    {"id": 14, "name": "Tel Aviv University", "image": "https://storage-prtl-co.imgix.net/endor/organisations/1069/logos/1674057011_untitled-design.png", "degrees":[""]},
    {"id": 15, "name": "Bar Ilan University", "image": "https://www.posenfoundation.co.il/wp-content/uploads/2020/04/posen-funding-BAR-ILAN.jpg", "degrees":[""]},
    {"id": 16, "name": "Haifa University", "image": "https://uhaifa.org/wp-content/uploads/2023/12/logo-square-400-400.jpg", "degrees":[""]},
    {"id": 17, "name": "Ben Gurion University", "image": "https://www.un-spider.org/sites/default/files/BGU-institution.PNG", "degrees":[""]},
    {"id": 18, "name": "Weizmann Institute Of Science", "image": "https://www.bionic-vision.org/images/logos/institutions/weizmann-institute-science.jpg", "degrees":[""]},
    {"id": 19, "name": "Ariel University", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPFFJjMmnTk8qS0AWOiIwQijAY7z7j6D1gsw&s", "degrees":[""]},
    {"id": 20, "name": "Bezalel", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAfhKkld81wFvZrYXBUpbYdxxFLFsH0bKNHQ&s", "degrees":[""]},
    {"id": 21, "name": "Shenkar", "image": "https://cumulusassociation.org/wp-content/uploads/2021/11/shenkar-Logo.jpeg", "degrees":[""]},
    {"id": 22, "name": "Ruppin Academic Center", "image": "https://yt3.googleusercontent.com/DAGGTqsHAftX6Eaw8Psk2dHqZBNBL3lUCKwiZ2U3XYi_3Mi50EDdadTeha8Oq6PWzXg0yD0i1Q=s900-c-k-c0x00ffffff-no-rj", "degrees":[""]},
    {"id": 23, "name": "The College of Management Academic Studies", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvBaQTT7KrY6q9YHCJ9vYliKNbaSPSVAL7AQ&s", "degrees":[""]},
    {"id": 24, "name": "SCE", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNaMEyiGIEwZcF3OmDzs-jN19Fnb44cX3KCg&s", "degrees":[""]},
    {"id": 25, "name": "The Academic College Of Law And Science", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ5ZtyHBTQKxGczdBa0z4hJVEMWnW2lQ1K-R_ipBzppp4OJEOwWWEfwFdjEekr5UGF7AA&usqp=CAU", "degrees":[""]},
    {"id": 26, "name": "The Academic College Levinsky - Wingate", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa08Q69MDPUXqWtfnhRw2hbSalI_6GIYir0w&s", "degrees":[""]},
    {"id": 27, "name": "Wingate Institute", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtX8BZZCSGIJefZVUJwykxml1D8AqGskbT3wQzETBavNpSyIhi1nrgXkT-cawm7EkDPH4&usqp=CAU", "degrees":[""]},
    {"id": 28, "name": "Peres Academic Center", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQeSmVd2OB7Bkg3xt1mL7-MK9fWgMigcbYOg&s", "degrees":[""]}
]

# get the items
@app.route('/items', methods=['GET'])
def get_items():
    return jsonify(items)

# get item with id
@app.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    item = next((i for i in items if i['id'] == item_id), None)
    if item:
        return jsonify(item)
    return jsonify({'error': 'Item not found'}), 404

# creat new item
@app.route('/items', methods=['POST'])
def create_item():
    data = request.get_json()
    new_item = {
        "id": len(items) + 1,
        "name": data.get('name'),
        "image": data.get('image')
    }
    items.append(new_item)
    return jsonify(new_item), 201

if __name__ == '__main__':
    app.run(debug=True)
