import matplotlib.pyplot as plt
import pandas as pd

hello = pd.read_csv("dataset/hello.csv", header=None).iloc[0, 1:].values.reshape(-1, 2)
name = pd.read_csv("dataset/name.csv", header=None).iloc[0, 1:].values.reshape(-1, 2)
my = pd.read_csv("dataset/my.csv", header=None).iloc[0, 1:].values.reshape(-1, 2)

plt.figure(figsize=(9, 3))

plt.subplot(1, 3, 1)
plt.scatter(hello[:, 0], hello[:, 1])
plt.title("hello")

plt.subplot(1, 3, 2)
plt.scatter(my[:, 0], my[:, 1])
plt.title("my")

plt.subplot(1, 3, 3)
plt.scatter(name[:, 0], name[:, 1])
plt.title("name")

plt.tight_layout()
plt.show()
