import csv

LINE_A = [
    "Sector 101",
    "Sector 83",
    "Sector 137",
    "Sector 142",
    "Okhla Bird Sanctuary",
    "Kalindi Kunj"
]

LINE_B = [
    "Botanical Garden",
    "Golf Course",
    "Noida City Centre",
    "Sector 62",
    "Sector 59",
    "Sector 52"
]

LINE_C = [
    "Yamuna Bank",
    "Akshardham",
    "Mayur Vihar-1",
    "Mayur Vihar Ext",
    "New Ashok Nagar"
]

INTERCHANGES = [
    ("Sector 142", "Noida City Centre"),
    ("Sector 83", "Akshardham"),
    ("Sector 52", "Yamuna Bank")
]

def ensure_csv_exists():
    try:
        open("tickets.csv", "r").close()
    except:
        with open("tickets.csv", "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["start", "end", "price", "route"])

def show_all_stations():
    print("\n------ LINE A ------")
    for s in LINE_A:
        print(s)

    print("\n------ LINE B ------")
    for s in LINE_B:
        print(s)

    print("\n------ LINE C ------")
    for s in LINE_C:
        print(s)

    print("\n------ INTERCHANGES ------")
    for a, b in INTERCHANGES:
        print(f"{a} <-> {b}")
    print()

def get_line(station):
    if station in LINE_A:
        return LINE_A
    if station in LINE_B:
        return LINE_B
    if station in LINE_C:
        return LINE_C
    return None

def get_interchange_between(line1, line2):
    for a, b in INTERCHANGES:
        if a in line1 and b in line2:
            return a, b
        if b in line1 and a in line2:
            return b, a
    return None

def create_segment(line, start, end):
    if start not in line or end not in line:
        return None
    i = line.index(start)
    j = line.index(end)
    segment = []
    if i <= j:
        k = i
        while k <= j:
            segment.append(line[k])
            k += 1
    else:
        k = i
        while k >= j:
            segment.append(line[k])
            k -= 1
    return segment

def find_simple_route(start, end):
    line1 = get_line(start)
    line2 = get_line(end)

    if not line1 or not line2:
        return None

    if line1 == line2:
        return create_segment(line1, start, end)

    interchange = get_interchange_between(line1, line2)
    if not interchange:
        return None

    i1, i2 = interchange  # i1 on start line, i2 on end line

    part1 = create_segment(line1, start, i1)
    part2 = create_segment(line2, i2, end)

    if part1 is None or part2 is None:
        return None

    # If the interchange station names are the same then avoid duplicate,
    # otherwise include both interchange stations in the combined route.
    if i1 == i2:
        return part1 + part2[1:]
    else:
        return part1 + part2

def save_ticket_to_csv(start, end, price, route):
    with open("tickets.csv", "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([start, end, price, " -> ".join(route)])

def buy_ticket():
    start = input("Enter starting station: ").strip()
    end = input("Enter destination station: ").strip()

    route = find_simple_route(start, end)
    if not route:
        print("\nNo route found.\n")
        return

    print("\nRoute Found:\n")
    for i in range(len(route)):
        print("to", route[i])

    price = (len(route) - 1) * 10
    print(f"\nTicket Price: Rs {price}\n")

    save_ticket_to_csv(start, end, price, route)
    print("Ticket saved to tickets.csv\n")

def view_tickets():
    try:
        with open("tickets.csv", "r") as f:
            reader = csv.DictReader(f)
            rows = list(reader)

            if not rows:
                print("\nNo tickets purchased yet.\n")
                return

            print("\n------ PURCHASED TICKETS ------\n")

            for row in rows:
                print(f"{row.get('start','Unknown')} to {row.get('end','Unknown')} | Rs {row.get('price','N/A')}")
                print("Route:", row.get("route","(no route stored)"))
                print()

    except FileNotFoundError:
        print("\nNo ticket file exists yet.\n")

def main():
    ensure_csv_exists()

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
            show_all_stations()
        elif choice == "2":
            buy_ticket()
        elif choice == "3":
            view_tickets()
        elif choice == "4":
            print("Goodbye")
            break
        else:
            print("Invalid choice\n")

main()

