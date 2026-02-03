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
S_f    &= \frac{1}{H_f} = \frac{2}{1/S_{f+} + 1/S_{f-}}
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
A hard clipper is not differentiable, and thus, not a valid clipping function on it's own. However, we can approximate it using a **soft clipper** $s$. A soft clipper also has a clipping threshold, but it also has a variable knee size $k \in (0, 1]$. A knee with zero size would be equivalent of not having a knee at all, which would be hard clipping. The soft clipper is linear at $T - k$, constant at $T + k$, and uses quadratic spline $P$ to interpolate smoothly between $T - k$ to $T + k$. The resulting function is a valid clipping function, however we are only using it here to analyze hard clipping, so we will ignore normalization. Then, a positive side soft clipper can be described as
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
It is trivial to see that the maximum of the second derivative of the soft clipper is completely determined by the spline. We can also immediately see that 
$$
H_{s+} = \max(-s''(x)) = -a = \frac{1}{4k},
$$
so the hardness of $s$ is completely determined by $k$ and the limit of hardness and softness of the soft clipper as the knee size approaches to hard clipping is
$$
\begin{align*}
H_h &= \lim_{k \to 0} \frac{1}{4k} = \infty \\
S_h &= \lim_{k \to 0} \frac{1}{H_h} = 0,
\end{align*}
$$
which seems very intuitive.

The analysis for negative side would be identical of course. However, it should be noted that asymmetrical hard clipping will always have a softness of zero, regardless of clipping thresholds of either side. In fact, the other side may not be clipped at all and the result is still zero. This may seem confusing and like it could undermine the usefulness of the model. And indeed, fully asymmetrical (one side linear) distortion will have a very distinct sound from symmetrical distortion. However, both asymmetrical and symmetrical hard clipping will have an important property: once a threshold is reached (doesn't matter which one or both), the sound is immediately notably distorted. This is what we are measuring.

## Normalization

The input gain controls the amount of distortion. The amount of distortion will clearly alter the subjective distortion characteristics, but it will also affect objective measurements, so it must be normalized first. Clipping results to harmonic distortion, so input gain will be normalized by **total harmonic distortion** (**THD**). This process will be discussed later in more detail.

We will define the input domain to be $x \in [-1, 1]$, which will also be used for relevant integration bounds. We will use real numbers instead of voltages or discrete values to retain generality to be applicable to digital and analog domains. It is important to note that in most cases this domain will only represent a subdomain of a system being modeled. Unfortunately, this means that we will lose some information. Consider the inverting amplifier diode soft clipper, which is a relatively common circuit used in guitar effects pedals. If we set the feedback resistor to a high value, we can approximate the circuit as a bipolar logarithm amplifier. According to [this article](https://www.analog.com/en/resources/analog-dialogue/articles/logarithmic-amplifiers-explained.html), such amplifier can be approximately modeled with an inverse hyperbolic sine $\text{arcsinh}(x$). The clipping threshold of this function is determined by the diode's forward voltage, which is typically approximated to be 0.6 V to 0.7 V for silicon P-N diodes. However, $\text{arcsinh}(x)$ does not converge, so the domain of this circuit is going to be the rails voltage, which could be as large as ±9 V for some pedals. Any input that is large enough to reach the rails are already so distorted that the output will resemble a square wave. There is no use analyzing such functions in their full domains, so it is acceptable to only observe the subdomain where the clipping is the most pronounced.

The output gain controls the overall volume. It does not change the clipping characteristics, but the hardness (the second derivative) is directly proportional to it, so it must be normalized. It will be normalized by total power of the clipping function, which is commonly described by **root mean square** (**RMS**):
$$
\text{RMS}_f = \sqrt{ \int\limits_{-1}^{1} f(x)^2 \,dx }
$$
However, RMS is also affected by DC (or **mean** $\mu$), which is inaudible and usually filtered out anyway, so we use **standard deviation** $\sigma$ instead, which measures AC power by subtracting the mean. To normalize the output gain, we set $A_\text{out}$ to
$$
\begin{align*}
\mu				&= \frac{1}{2} \int\limits_{-1}^{1} f(x) \,dx \\
A_\text{out}	&= \frac{1}{\sigma_f} = \frac{1}{\sqrt{ \int_{-1}^{1} (f(x) - \mu)^2 \,dx }}.
\end{align*}
$$
It is worth noting that $\text{RMS}_f = \sigma_f$ when $\mu = 0$. This will be the case for any symmetric clipping function. 
