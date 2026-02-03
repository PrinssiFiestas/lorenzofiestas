# Blunter THD

The Blunter is defined as
$$
B(x) = \begin{cases}
		2x - |x|x,      & |x| < 1 \\
		\text{sign}(x), & |x| \ge 1
	\end{cases}
$$


To find the normalized THD of the Blunter, we feed a sine wave to it and calculate the resulting Fourier series. So our input will be 
$$
x(t) = B(\sin(\pi t)).
$$


The Fourier series can be described in the following form:
$$
x(t)=\frac{a_0}{2}+\sum_{n=1}^{\infin}\left( a_n\cos(\omega nt) + b_n\sin(\omega nt)\right),
$$
where $\omega = 2\pi/(t_1-t_0)$ is the fundamental frequency, $a_0/2$ is the DC offset, and $n \in \N$. The coefficients $a_n$ and $b_n$ can be computed as follows:
$$
\begin{align*}
a_n    &= \frac{2}{t_1 - t_0}\int\limits_{t_0}^{t_1}x(t)\cos(\omega nt)\,dt \\
b_n    &= \frac{2}{t_1 - t_0}\int\limits_{t_0}^{t_1}x(t)\sin(\omega nt)\,dt \\
\end{align*}
$$
Since THD will not depend on frequency, we will set $t_0 = -1$ and $t_1 = 1$ for convenience. This will give us $t_1 - t_0 = 2$ and thus,
$$
\begin{align*}
a_n    &= \int\limits_{-1}^{1}x(t)\cos(\omega nt)\,dt \\
b_n    &= \int\limits_{-1}^{1}x(t)\sin(\omega nt)\,dt \\
\omega &= \pi.
\end{align*}
$$
We'll use $\pi$ instead of $\omega$ from now on. 

A function such that $f(-x) = -f(x)$ for all $x$ is said to be odd. The Blunter is a symmetric clipper meaning that $B(-x) = -B(x)$ making it an odd function. $\sin(x)$ is also odd, so they will compose to an odd function as well. On the other hand, $\cos(x)$ is even, but multiplying it with the odd function $B(sin(\pi t))$ will result to an odd function. Integrating any odd function on a closed symmetric interval will be zero. Therefore, 
$$
a_n = \int\limits_{-1}^{1}B(\sin(\pi t))\cos(\pi nt)\,dt = 0
$$
for all $n$. A clipper also cannot be symmetric if it has DC offset, so $a_0$ is also zero. This leaves us with
$$
b_n = \int\limits_{-1}^{1}B(\sin(\pi t))\sin(\pi n t)\,dt
$$
to be computed. $\sin(\pi t)$ has an amplitude of one, so we can consider the Blunter to be just $2x - |x|x$ without limiting. Therefore,
$$
\begin{align*}
b_n &= \int\limits_{-1}^{1}\left( 2 \sin(\pi t) 
		- |\sin(\pi t)| \sin(\pi t) \right)\sin(\pi n t)\,dt \\
	&= 2\int\limits_{-1}^{1}\sin(\pi t)\sin(\pi n t)\,dt 
		- \int\limits_{-1}^{1}|\sin(\pi t)|\sin(\pi t)\sin(\pi n t)\,dt \\
\end{align*}
$$
Functions $\sin(\pi t)$ and $\sin(\pi n t)$ are orthonormal on $[-1, 1]$ when $n = 1$, orthogonal otherwise, so we can use the **unit function** $\varepsilon$ like so:
$$
\int\limits_{-1}^{1}\sin(\pi t)\sin(\pi n t)\,dt = \varepsilon(n) =
	\begin{cases}
		1, & n   = 1 \\
		0, & n \ne 1
	\end{cases} \\

b_n = 2\varepsilon(n) - \int\limits_{-1}^{1}|\sin(\pi t)|\sin(\pi t)\sin(\pi n t)\,dt.
$$
Let $I$ be the remaining integral. It's function to be integrated is continuous, so we can split it at zero. The resulting domains allows us to remove the absolute value. A function such that $f(-x) = f(x)$ for all $x$ is said to be even. It should be obvious to see that for such function flipping the signs for integration limits will not change it's value. $\sin(\pi t)$ is an odd function, but squaring it will be result to an even function. Given this information,
$$
\begin{align*}
I	&= \int\limits_{-1}^{1}|\sin(\pi t)|\sin(\pi t)\sin(\pi n t)\,dt \\
	&= \int\limits_{0}^{1}\sin(\pi t)\sin(\pi t)\sin(\pi n t)\,dt
		- \int\limits_{-1}^{0}\sin(\pi t)\sin(\pi t)\sin(\pi n t)\,dt \\
	&= \int\limits_{0}^{1}\sin(\pi t)^2\sin(\pi n t)\,dt
		+ \int\limits_{0}^{-1}\sin(\pi t)^2\sin(\pi n t)\,dt \\
	&= \int\limits_{0}^{1}\sin(\pi t)^2\sin(\pi n t)\,dt
		+ \int\limits_{0}^{1}\sin(\pi t)^2\sin(\pi n t)\,dt \\
	&= 2 \int\limits_{0}^{1}\sin(\pi t)^2\sin(\pi n t)\,dt.
\end{align*}
$$
Using trigonometric identities
$$
\begin{align*}
\sin(\pi t)^2  &= \frac{1}{2}(1 - \cos(2\pi t)) \\
\sin(a)\cos(b) &= \frac{1}{2}\sin(a - b) + \frac{1}{2}\sin(a + b)
\end{align*}
$$
we get
$$
\begin{align*}
I	&= \int\limits_0^1(1 - \cos(2\pi t))\sin(\pi n t)\,dt \\
	&= \int\limits_0^1\sin(\pi n t)\,dt - \int\limits_0^1\cos(2\pi t)\sin(\pi n t)\,dt \\
	&= \int\limits_0^1\sin(\pi n t)\,dt 
		- \frac{1}{2} \int\limits_0^1\sin(\pi n t - 2\pi t)\,dt
		- \frac{1}{2} \int\limits_0^1\sin(\pi n t + 2\pi t)\,dt \\
	&= \int\limits_0^1\sin(\pi n t)\,dt 
		- \frac{1}{2} \int\limits_0^1\sin(\pi(n - 2)t)\,dt
		- \frac{1}{2} \int\limits_0^1\sin(\pi(n + 2)t)\,dt.
\end{align*}
$$
For any $k \in \N$, $\cos(\pi k) = (-1)^k$ and
$$
\begin{equation}
\int\limits_0^1\sin(\pi k t)\,dt 
	= -\mathop{\bigg/}\limits_0^1 \frac{\cos(\pi k t)}{\pi k}
	= -\left( \frac{\cos(\pi k)}{\pi k} - \frac{\cos(0)}{\pi k} \right)
	= \frac{1 - \cos(\pi k)}{\pi k}
	= \frac{1 - (-1)^k}{\pi k}.
\end{equation}
$$
This can be used like so:
$$
\begin{align*}
I	&= \frac{1 - (-1)^n}{\pi n}
		- \frac{1}{2} \cdot \frac{1 - (-1)^{n-2}}{\pi(n-2)}
		- \frac{1}{2} \cdot \frac{1 - (-1)^{n+2}}{\pi(n+2)} \\
	&= (1 - (-1)^n) \left(\frac{1}{\pi n} - \frac{1}{2\pi(n-2)} - \frac{1}{2\pi(n+2)}\right) \\
	&= (1 - (-1)^n) \frac{2(n - 2)(n + 2) - n(n + 2) - n(n - 2)}{2\pi n (n - 2)(n + 2)} \\
	&= (1 - (-1)^n) \frac{2n^2 - 8 - n^2 - 2 n - n^2 + 2 n}{2\pi n(n^2 - 4)} \\
	&= (1 - (-1)^n) \frac{-8}{2(\pi n^3 - 4\pi n)} \\
	&= - \frac{4( 1 - (-1)^n)}{\pi n^3 - 4\pi n}.
\end{align*}
$$
Now we can substitute $I$ to the original equation for $b_n$ coefficients. So finally,
$$
b_n = 2\varepsilon(n) + \frac{4(1 - (-1)^n)}{\pi n^3 - 4\pi n}.
$$
TODO address odd $b_n$. 