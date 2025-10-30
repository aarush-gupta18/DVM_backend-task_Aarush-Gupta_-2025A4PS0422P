import csv
from collections import deque

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

INTERCHANGE_SET = set(INTERCHANGES) | {(b, a) for (a, b) in INTERCHANGES}

def build_graph():
    graph = {}

    def add_edge(a, b):
        if a not in graph:
            graph[a] = set()
        if b not in graph:
            graph[b] = set()
        graph[a].add(b)
        graph[b].add(a)

    for i in range(len(LINE_A) - 1):
        add_edge(LINE_A[i], LINE_A[i+1])

    for i in range(len(LINE_B) - 1):
        add_edge(LINE_B[i], LINE_B[i+1])

    for i in range(len(LINE_C) - 1):
        add_edge(LINE_C[i], LINE_C[i+1])

    for a, b in INTERCHANGES:
        add_edge(a, b)

    return graph

def find_route(graph, start, end):
    if start not in graph or end not in graph:
        return None

    queue = deque([[start]])
    visited = set([start])

    while queue:
        path = queue.popleft()
        node = path[-1]

        if node == end:
            return path

        for n in graph[node]:
            if n not in visited:
                visited.add(n)
                queue.append(path + [n])

    return None

def show_all_stations():
    print("\nLINE A")
    for s in LINE_A: 
        print(s)

    print("\nLINE B")
    for s in LINE_B: 
        print(s)

    print("\nLINE C")
    for s in LINE_C: 
        print(s)

    print("\nINTERCHANGES")
    for a, b in INTERCHANGES:
        print(f"{a} to {b}")
    print()

def ensure_csv_exists():
    try:
        open("tickets.csv", "r").close()
    except:
        with open("tickets.csv", "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["start", "end", "price", "route"])

def save_ticket_to_csv(start, end, price, route):
    with open("tickets.csv", "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([start, end, price, " -> ".join(route)])

purchased_tickets = []

def buy_ticket(graph):
    start = input("Enter starting station: ").strip()
    end = input("Enter destination station: ").strip()

    route = find_route(graph, start, end)
    if not route:
        print("\nNo route found.\n")
        return

    print("\nRoute Found:\n")
    for i in range(len(route)):
        print("to", route[i])
        if i < len(route) - 1:
            if (route[i], route[i+1]) in INTERCHANGE_SET:
                print(f"    Interchange at {route[i]} to {route[i+1]}\n")

    price = (len(route) - 1) * 10
    print(f"\nTicket Price: Rs {price}\n")

    purchased_tickets.append((start, end, price, route))
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

            print("\nPURCHASED TICKETS\n")

            for row in rows:
                start = row.get("start", "Unknown")
                end = row.get("end", "Unknown")
                price = row.get("price", "N/A")
                route = row.get("route", "(no route stored)")

                print(f"{start} to {end} | Rs {price}")
                print("Route:", route)
                print()

    except FileNotFoundError:
        print("\nNo ticket file exists yet.\n")

def main():
    ensure_csv_exists()
    graph = build_graph()

    while True:
        print("\n==============================")
        print("METRO TICKET SYSTEM")
        print("==============================")
        print("1. Show All Stations")
        print("2. Buy Ticket")
        print("3. View Purchased Tickets")
        print("4. Exit")

        ch = input("Enter choice: ").strip()

        if ch == "1":
            show_all_stations()
        elif ch == "2":
            buy_ticket(graph)
        elif ch == "3":
            view_tickets()
        elif ch == "4":
            print("Goodbye")
            break
        else:
            print("Invalid choice\n")

main()
