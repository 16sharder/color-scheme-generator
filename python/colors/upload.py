# Upload (python server) is used to retrieve the colors from the provided path's image

from PIL import Image
import zmq

# creates a socket to receive from the client
context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://*:1952")

end = True

while end:
    # once a message has been received, decodes it
    message = socket.recv()
    message = message.decode("utf-8")
    message = eval(message)

    # image_path is not null when requesting the main colors of the image
    if message[0] == "path":
        image_path = message[1]
        print(f"Received path request: {image_path}")

        # attempts to open the file
        try:
            image = Image.open(image_path)

        # if the attempt fails, sends error message
        except FileNotFoundError:
            print(f"Sending reply: File not found")
            socket.send(bytes("File not found", encoding='utf-8'))
            continue
        except IsADirectoryError:
            print(f"Sending reply: Directory")
            socket.send(bytes("Directory", encoding='utf-8'))
            continue
        except PermissionError:
            print(f"Sending reply: Permission denied")
            socket.send(bytes("Permission denied", encoding='utf-8'))
            continue

        pixels = image.load()
        width = image.size[0]
        height = image.size[1]
        dictionary = dict()

        # iterates over each pixel of the image
        for w in range(width):
            for h in range(height):
                pixel = pixels[w, h]
                pixel = pixel[:3]

                # puts the pixel's color into one of 27 categories
                r = pixel[0] // 85      # 255/85 = 3 categories for red
                g = pixel[1] // 85      # times 3 categories for green
                b = pixel[2] // 85      # times 3 categories for blue

                # if that category is already in the dictionary
                if (r, g, b) in dictionary:
                    cat = dictionary[(r, g, b)]

                    # adds this pixel to the number of pixels found in that category
                    cat["count"] += 1

                    # adds one to the count for that specific pixel
                    if pixel in cat:
                        cat[pixel] += 1
                    else:
                        cat[pixel] = 1

                # if the category is not in the dictionary, adds it in
                else:
                    dictionary[(r, g, b)] = {pixel: 1,
                                            "count": 1}

        # creates a set of num of pixels found in each category
        counts = set()
        for item in dictionary:
            cat = dictionary[item]
            counts.add(cat["count"])

        # finds the 6 highest pixel counts in the set
        maxes = []
        for i in range(6):
            a = max(counts)
            counts.remove(a)
            maxes.append(a)

        # identifies the 6 categories coordinating with those counts
        cats = []
        for item in dictionary:
            cat = dictionary[item]
            for num in maxes:
                if cat["count"] == num:
                    cats.append(cat)

        # finds the pixel in each category with the highest indiv count
        colors = []
        for cat in cats:
            color = None
            maxi = 0
            for pixel in cat:
                if pixel == "count":
                    continue
                if cat[pixel] > maxi:
                    color = pixel
                    maxi = cat[pixel]
            colors.append(color)

        # sends back the main color results
        originals = colors.copy()
        orig_cats = cats.copy()
        orig_counts = counts.copy()
        print(f"Sending reply: {colors}")
        socket.send_json(colors)

    # image path is null when requesting the details of the image
    # this section will always only be called after the previous section has executed
    elif message[0] == "details":
        print(f"Received request for details")

        details = dict()
        i = 1

        # iterates over each color category
        for cat in cats:
            highest = []
            # iterates over each pixel in the category and appends its frequency
            for pixel in cat:
                if pixel == "count":
                    continue
                highest.append(cat[pixel])

            # sorts the frequency list and cuts it at 100
            highest.sort(reverse=True)
            if len(highest) > 100:
                highest = highest[:100]

            # for each pixel in the category, determines if its frequency is in highest
            for pixel in cat:
                if pixel == "count":
                    continue
                try:
                    idx = highest.index(cat[pixel])
                    lest = list(pixel)
                    # appends the frequency to the rgb vals [r, g, b, frequency]
                    lest.append(cat[pixel])
                    highest[idx] = lest
                except ValueError:
                    continue

            details[f"cat{i}"] = highest
            i += 1

        # sends on the resulting list of categories with highest pixels
        print("Sending details")
        socket.send_json([colors, details])

    elif message[0] == "originals":
        colors = originals.copy()
        cats = orig_cats.copy()
        counts = orig_counts.copy()
        print(f"Sending originals: {originals}")
        socket.send_json(originals)

    elif message[0] == "delete":
        idx = message[1]
        print(f"Received delete request: {idx}")

        a = max(counts)
        counts.remove(a)

        # identifies the 6 categories coordinating with those counts
        for item in dictionary:
            cat = dictionary[item]
            if cat["count"] == a:
                cats[idx] = cat

        color = None
        maxi = 0
        cat = cats[idx]
        for pixel in cat:
            if pixel == "count":
                continue
            if cat[pixel] > maxi:
                color = pixel
                maxi = cat[pixel]
        colors[idx] = color

        # sends back the main color results
        print(f"Sending reply: {colors}")
        socket.send_json(colors)

    else:
        socket.send_json(None)
