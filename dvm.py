import csv

class Line:
    def __init__(self, title, stops):
        self.title = title
        self.stops = stops

    def has(self, stop):
        return stop in self.stops

    def segment(self, start, end):
        if start not in self.stops or end not in self.stops:
            return None
        i = self.stops.index(start)
        j = self.stops.index(end)
        path = []
        if i <= j:
            k = i
            while k <= j:
                path.append(self.stops[k])
                k += 1
        else:
            k = i
            while k >= j:
                path.append(self.stops[k])
                k -= 1
        return path


class Network:
    def __init__(self):
        self.a = Line("A", [
            "Sector 101", "Sector 83", "Sector 137", "Sector 142",
            "Okhla Bird Sanctuary", "Kalindi Kunj"
        ])

        self.b = Line("B", [
            "Botanical Garden", "Golf Course", "Noida City Centre",
            "Sector 62", "Sector 59", "Sector 52"
        ])

        self.c = Line("C", [
            "Yamuna Bank", "Akshardham", "Mayur Vihar-1",
            "Mayur Vihar Ext", "New Ashok Nagar"
        ])

        self.lines = [self.a, self.b, self.c]

        self.links = [
            ("Sector 142", "Noida City Centre"),
            ("Sector 83", "Akshardham"),
            ("Sector 52", "Yamuna Bank")
        ]

        self.make_csv()

    def make_csv(self):
        try:
            open("tickets.csv", "r").close()
        except:
            with open("tickets.csv", "w", newline="") as f:
                writer = csv.writer(f)
                writer.writerow(["start", "end", "price", "route"])

    def find_line(self, stop):
        for line in self.lines:
            if line.has(stop):
                return line
        return None

    def find_link(self, line1, line2):
        for a, b in self.links:
            if a in line1.stops and b in line2.stops:
                return a, b
            if b in line1.stops and a in line2.stops:
                return b, a
        return None

    def route(self, start, end):
        l1 = self.find_line(start)
        l2 = self.find_line(end)

        if not l1 or not l2:
            return None

        if l1 == l2:
            return l1.segment(start, end)

        link = self.find_link(l1, l2)
        if not link:
            return None

        x1, x2 = link
        p1 = l1.segment(start, x1)
        p2 = l2.segment(x2, end)

        if x1 == x2:
            return p1 + p2[1:]
        return p1 + p2

    def save(self, start, end, path):
        price = (len(path) - 1) * 10
        with open("tickets.csv", "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([start, end, price, " -> ".join(path)])
        return price

    def show_stops(self):
        print("\nLINE A")
        for s in self.a.stops:
            print(s)

        print("\nLINE B")
        for s in self.b.stops:
            print(s)

        print("\nLINE C")
        for s in self.c.stops:
            print(s)

        print("\nINTERCHANGES")
        for a, b in self.links:
            print(a, " <-> ", b)
        print()

    def show_saved(self):
        try:
            with open("tickets.csv", "r") as f:
                reader = csv.DictReader(f)
                rows = list(reader)

                if not rows:
                    print("\nNo tickets purchased yet\n")
                    return

                print("\nSAVED TICKETS\n")
                for row in rows:
                    print(row["start"], "to", row["end"], "| Rs", row["price"])
                    print("Route", row["route"])
                    print()

        except FileNotFoundError:
            print("\nNo ticket file\n")


def main():
    metro = Network()

    while True:
        print("\n==============================")
        print("METRO TICKET SYSTEM")
        print("==============================")
        print("1. Show All Stations")
        print("2. Buy Ticket")
        print("3. View Purchased Tickets")
        print("4. Exit")

        choice = input("Enter choice: ").strip()

        if choice == "1":
            metro.show_stops()

        elif choice == "2":
            start = input("Enter starting station: ").strip()
            end = input("Enter destination station: ").strip()

            path = metro.route(start, end)
            if not path:
                print("\nNo route found\n")
            else:
                print("\nRoute Found\n")
                for p in path:
                    print("to", p)

                price = metro.save(start, end, path)
                print("\nTicket Price Rs", price)
                print("Ticket saved to tickets.csv\n")

        elif choice == "3":
            metro.show_saved()

        elif choice == "4":
            print("Exitted Successfully")
            break

        else:
            print("Invalid choice\n")


main()

