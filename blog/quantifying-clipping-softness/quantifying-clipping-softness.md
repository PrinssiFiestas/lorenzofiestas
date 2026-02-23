# Quantifying Clipping Softness

## Definitions

A **clipping function** $f$ shall be any function that is non-linear, differentiable, monotonically increasing. Clipping is a form of wave shaping, so it must be non-linear by definition. Monotonicity rules out wave folding effects, the function's output must not change when increasing input beyond it's limits. Additionally, $f'$ shall be unimodal (bell shaped) and nonnegative for all real inputs. This means that $f$ must be a Sigmoid function. 

For any meaningful analysis the clipping function must be normalized. For any clipping function $f$, a **normalized clipping function** $f_1$ is defined as
$$
f_1(x) = A_\text{out} f(A_\text{in} x),
$$
where $A_\text{in}$ is the **input gain** and $A_\text{out}$ is the **output gain**. 

Simplified clipping hardness $H_f$ and softness $S_f$ of any given clipping function can be defined as
$$
\begin{align*}
H_f	&= \max(|f_1''(x)|) \\
S_f	&= \frac{1}{H_f}.
\end{align*}
$$
The maximum absolute value of the second derivate describes how abruptly a signal changes it's behavior. It is  analogous to acceleration in kinematics. We only care about it's magnitude, thus absolute value is taken.

The simplified model assumes symmetric clipping. For asymmetric clipping, we have to consider both sides of the waveform. We simply take the mean of the extremes like so:
$$
\begin{align*}
H_{f+} &= \max(-f_1''(x)),  & x \ge 0 \\
H_{f-} &= \max(f_1''(x)),   & x   < 0 \\
S_{f+} &= \frac{1}{H_{f+}}, & x \ge 0 \\
S_{f-} &= \frac{1}{H_{f-}}, & x   < 0 \\
H_f    &= \frac{H_{f+} + H_{f-}}{2}   \\
S_f    &= \frac{1}{H_f} = \frac{2}{1/S_{f+} + 1/S_{f-}}.
\end{align*}
$$

## Hard Clipping

Our model is already powerful enough to do analysis of **hard clipper** $h$. Hard clipper is a special case that does not need to be normalized to determine it's hardness and softness, so we will set it's input and output gains to one. We only need to consider the other side of the waveform for this analysis, we will use the positive side. A hard clipper will be linear until a threshold $T$ is reached after which the output stays constant. We will set this threshold to one. Then, a positive side hard clipper can be described as
$$
h(x) = \begin{cases}
		x, & x < 1 \\
		1, & x \ge 1.
	\end{cases}
$$
A hard clipper is not differentiable, and thus, not a valid clipping function on it's own. However, we can approximate it using a **soft clipper** $s$. A soft clipper also has a clipping threshold, but it also has a variable knee size $k \in (0, 1]$. A knee with zero size would be equivalent of not having a knee at all, which would be hard clipping. The soft clipper is linear below $T - k$, constant above $T + k$, and uses quadratic spline $P$ to interpolate smoothly between $T - k$ to $T + k$. The resulting function is a valid clipping function, however we are only using it to analyze hard clipping, so we will ignore normalization. Then, a positive side soft clipper can be described as
$$
\begin{align*}
P(x) &= ax^2 + bx + c \\
a    &= -\frac{1}{4k} \\
b    &= \frac{1}{2} + \frac{1}{2k} \\
c    &= \frac{1}{2} - \frac{1}{4k} - \frac{1}{4}k \\
s(x) &= \begin{cases}
		x,		& x < 1 - k \\
		P(x),	& 1 - k \le x < 1 + k \\
		1,		& 1 + k \le x.
	\end{cases}
\end{align*}
$$
It is trivial to see that the maximum of the second derivative of the soft clipper is completely determined by the spline. We can also see that 
$$
H_{s+} = \max(-s''(x)) = \max(-a) = \frac{1}{4k},
$$
so the hardness of $s$ is completely determined by $k$ and the limit of hardness and softness of the soft clipper as the knee size approaches to hard clipping is
$$
\begin{align*}
H_h &= \lim_{k \to 0+} \frac{1}{4k} = \infty \\
S_h &= \lim_{k \to 0+} \frac{1}{H_h} = 0,
\end{align*}
$$
which seems rather intuitive.

The analysis for negative side would be identical of course. However, it should be noted that asymmetrical hard clipping will always have a softness of zero, regardless of clipping thresholds of either side. In fact, the other side may not be clipped at all and the result is still zero. This may seem confusing and like it could undermine the usefulness of the model. And indeed, fully asymmetrical (one side linear) clipping will have a very distinct sound from symmetrical clipping. However, both asymmetrical and symmetrical hard clipping have an important property: once a threshold is reached (doesn't matter which one or both), the sound is immediately notably distorted. The ambiguity of the clipping threshold is what softness is measuring, a complete description of tonal characteristics of any given clipping function is outside of the scope of this article.

While we only needed to consider simplified unipolar hard clipper and soft clipper, their complete descriptions can be very useful for DSP or other purposes. So for completeness, the full generic description of asymmetric hard clipper and soft clipper is as follows:
$$
\begin{align*}
h(x) &= \begin{cases}
		T_-, & x < T_- \\
		x,   & T_- \le x < T_+ \\
		T_+, & T_+ \le x
	\end{cases} \\

P_+(x) &= -\frac{1}{4k_+}x^2 
			+ \left( \frac{1}{2} + \frac{T_+}{2k_+} \right)x 
			+ \left( -\frac{T_+^2}{4k_+}+\frac{T_+}{2}-\frac{k_+}{4} \right) \\

P_-(x) &= \frac{1}{4k_-}x^2 
			+ \left( \frac{1}{2} - \frac{T_-}{2k_-} \right)x 
			+ \left( \frac{T_-^2}{4k_-}+\frac{T_-}{2}+\frac{k_-}{4} \right) \\

s(x) &= \begin{cases}
		T_-,     & x \le T_- - k_- \\
		P_-(x), & T_- - k_- < x \le T_- + k_- \\
		x,		& T_- + k_- < x < T_+ - k_+ \\
		P_+(x),	& T_+ - k_+ \le x < T_+ + k_+ \\
		T_+,	& T_+ + k_+ \le x,
	\end{cases}
\end{align*}
$$
where $T_- < 0$, $T_+ > 0$, $k_- \in (0, -T_-]$, and $k_+ \in (0, T_+]$. Symmetric hard and soft clippers are simpler:
$$
\begin{align*}

h(x) &= \begin{cases}
		x, & |x| < T \\
		T \, \text{sign}(x), & |x| \ge T
	\end{cases} \\

P(x) &= -\frac{1}{4k} 
		+ \left( \frac{1}{2} + \frac{T}{2k} \right)x
		+ \left( -\frac{T^2}{4k}+\frac{T}{2}-\frac{k}{4} \right) \\

s(x) &= \begin{cases}
		x, & |x| < T - k \\
		\text{sign}(x)P(|x|), & T - k \le |x| < T + k \\
		T\,\text{sign}(x), & T + k \le |x|,
	\end{cases}

\end{align*}
$$
where $T > 0$ and $k \in (0, T]$. 

## Normalization

The input gain controls the amount of clipping distortion. The amount of clipping will clearly alter the subjective and objective distortion characteristics, so it must be normalized. Input gain affects the output level (but not the other way around), so it must be normalized before output gain normalization. Clipping results to harmonic distortion, so input gain will be normalized by measuring the **total harmonic distortion** (**THD**) of the clipping function by passing $\sin(\pi x)$ with an amplitude of one to it. This process will be discussed later in more detail. 

The value of THD for normalization will affect softness. Consider any clipper that converges to some limit like the quadratic soft clipper. Given a periodic input, large amounts of input gain would make the output to converge to a square wave with well defined amplitude. But many soft clippers (like $\arctan(x)$) do not converge. The resulting output of such functions do not necessarily resemble a square wave as closely with large amounts of input gain making it sound smoother. With lower gains, however, $\arctan(x)$ has more noticeable clipping threshold, which is described well by the maximum of the second derivative. We will be focusing on lower input gains in this article.

We will define the input domain to be $x \in [-1, 1]$, which will also be used for relevant integration bounds. We will use real numbers instead of voltages or discrete values to retain generality to be applicable to digital and analog domains. It is important to note that in most cases this domain will only represent a subdomain of a system being modeled. Unfortunately, this means that we will lose some information. Consider the inverting amplifier diode soft clipper, which is a relatively common circuit used in guitar effects pedals. If we set the feedback resistor to a high value, we can approximate the circuit as a bipolar logarithm amplifier. According to [this article](https://www.analog.com/en/resources/analog-dialogue/articles/logarithmic-amplifiers-explained.html), such amplifier can be approximately modeled with an inverse hyperbolic sine $\text{arcsinh}(x$). The clipping threshold of this function is determined by the diode's forward voltage, which is typically approximated to be 0.6 V to 0.7 V for silicon P-N diodes. However, $\text{arcsinh}(x)$ does not converge, so the domain of this circuit is going to be the rails voltage, which could be as large as ±9 V for some pedals. Any signal that is large enough to reach the rails despite diode clipping will be very close to a square wave due to diode clipping. There is no use analyzing such functions in their full domains, so it is acceptable to only observe the subdomain where the clipping is the most pronounced. It is also required to limit the domain for any meaningful THD normalization, which what we do for fairness anyway. 

The output gain controls the overall volume. It does not change the clipping characteristics, but the hardness (the second derivative) is directly proportional to it, so it must be normalized. It will be normalized by total power of the clipping function, which is commonly described by **root mean square** (**RMS**):
$$
\begin{equation}
\text{RMS}_f = \sqrt{ \int_{-1}^{1} f(A_\text{in} x)^2 \,dx } \label{rms}
	= \sqrt{ \int_{-A_\text{in}}^{A_\text{in}} f(x)^2 \,dx }
\end{equation}
$$
However, RMS is also affected by DC (or **mean** $\mu$), which is inaudible and usually filtered out anyway in practical applications, so we use **standard deviation** $\sigma$ instead, which measures the AC power by subtracting the mean. To normalize the output gain, we set $A_\text{out}$ to
$$
\begin{align*}
\mu				&= \frac{1}{2} \int\limits_{-1}^{1} f(A_\text{in} x) \,dx \\
A_\text{out}	&= \frac{1}{\sigma_f} 
					= \frac{1}{\sqrt{ \int_{-1}^{1} (f(A_\text{in} x) - \mu)^2 \,dx }}.
\end{align*}
$$
It is worth noting that $\text{RMS}_f = \sigma_f$ when $\mu = 0$. This will be the case for any symmetric clipping function, so using RMS for symmetric functions is valid. 

## The Blunter

There exists a symmetric clipper that is smoother than any other symmetric clipper for a range of THD normalization values, which we will call **the Blunter**. We will be referring to it quite a lot, so it worth defining and naming it. The unnormalized Blunter is defined as 
$$
\begin{align*}
B(x) &= \begin{cases}
		2x - |x|x,      & |x| \le 1 \\
		\text{sign}(x), & |x| \gt 1
	\end{cases} \\
	&= \begin{cases}
		-1,       & x \lt -1  \\
		2x + x^2, & -1 \le x \lt 0 \\
		2x - x^2, & 0 \le x \le 1 \\
		1,        & 1 \lt x.
	\end{cases}
\end{align*}
$$
The Blunter is equivalent to the quadratic soft clipper when knee $k = T$ the only difference being normalization constants. The normalized Blunter is
$$
B_1(x) = A_{B\text{out}} B(A_{B\text{in}} x).
$$
**Lemma.** *For all normalized THD values such that* $A_{B\text{in}} \le 1$, *the Blunter is the smoothest symmetric clipper.*

*Proof.* As mentioned earlier, input gain normalization uses a sinusoid with an amplitude of one. Also $A_{B\text{in}} \le 1$, so the input $|x(t)| = |\sin(\pi x(t))| \le 1$, so we don't need to consider $B(x) = \text{sign}(x)$ part. Additionally, the clipper is symmetric, so we only need to consider $B(x) = 2x - x^2$ and $x \in [0, 1]$. All statements for this poof will be for all $x \in [0, 1]$ if not stated otherwise. 

If we let $A = A_{B\text{out}}A_{B\text{in}}$, then
$$
\begin{align*}
B_1(x) &= 2Ax - A^2 x^2 \\
H_B    &= \max(-B_1''(x)) = \max(A^2) = A^2.
\end{align*}
$$
As we can see, the hardness of the Blunter is a constant. Therefore, to be smoother, a clipping function must have it's second derivative's absolute value below $A^2$ at all points. We will prove this to be impossible by contradiction. 

Assume that there is a symmetric clipping function $f$ such that
$$
H_{f+} = -f''(x) < A^2 \iff -f''(x) < -B_1''(x).
$$
We'll define another symmetric function $g$ such that
$$
\begin{align*}
-f''(x) = -B_1''(x) + g''(x) &< A^2 \\
g''(x) &< A^2 - A^2 \\
g''(x) &< 0.
\end{align*}
$$
Integrating $f''$ obviously gives us
$$
f(x) = \iint f''(x) \,dxdx = \iint (B_1''(x) - g''(x)) \,dxdx = B_1(x) - g(x)
$$
Since clipping functions are Sigmoid functions, we know that 
$$
\begin{align*}
B_1(0) &= 0 \\
f(0)   &= 0 \\
B_1(0) - g(0) &= 0 \\
g(0) &= 0
\end{align*}
$$


and
$$
\begin{align*}
f(x) &\gt 0 \\
B_1(x) - g(x) &\gt 0 \\
-g(x) &> -B_1(x) \\
g(x) &< B_1(x)
\end{align*}
$$
for all $x \ne 0$. Furthermore, Sigmoid functions have non-negative derivatives, so
$$
\begin{align*}
f'(x) &\ge 0 \\
B_1'(x) - g'(x) &\ge 0 \\
-g'(x) &\ge -B_1'(x) \\
g'(x) &\le B_1'(x)
\end{align*}
$$
Clipping functions are normalized by definition, which means that $f$ should be normalized as well. The positive RMS of $f$ is
$$
\begin{align*}
\text{RMS}_{f+} &= \sqrt{ \int_0^1 f(x)^2 \,dx } \\
	&= \sqrt{ \int_0^1 (B_1(x) - g(x)) ^2 \,dx }.
\end{align*}
$$
$B_1$ is normalized, so it's positive RMS should be equal to $\text{RMS}_{f+}$. This leads us to
$$
\begin{align*}
\text{RMS}_{f+} &= \text{RMS}_{B+} \\
\sqrt{\int_0^1(B_1(x) - g(x))^2\,dx} &= \sqrt{\int_0^1 B_1(x)^2\,dx} \\
\sqrt{\int_0^1(B_1(x)^2 - 2B_1(x)g(x) + g(x)^2)\,dx} &= \sqrt{\int_0^1 B_1(x)^2\,dx}
\end{align*}
$$